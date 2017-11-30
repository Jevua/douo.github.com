---
title: Databinding
date: '2017-06-17'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

 Binding

data binding 可以兼容到 API 7。

build.gradle 启用 databinding：

    android {
        …
        dataBinding.enabled = true
    }

 以 `layout` 标签圈起来的 layout 文件，才会被 databinding 框架处理。

    <layout xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:tools="http://schemas.android.com/tools">
        <RelativeLayout
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                …
        </RelativeLayout>
    </layout>

框架将会为 layout 文件生成一个 DataBinding 类，比如 activity_main.xml 生成的类为 `ActivityMainBinding`。

 在 Activity 中 获取 Binding 实例。
 
    HelloWorldBinding binding = 
        DataBindingUtil.setContentView(this, R.layout.hello_world);
    binding.hello.setText("Hello World")

- [Data Binding Library | Android Developers](https://developer.android.com/topic/libraries/data-binding/index.html)
- [George Mount – Medium](https://medium.com/@georgemount007)

#### 不再需要 findViewbyId

databinding 框架能起到取代 butterknife 的作用，甚至还更简单，无需自己声明属性和写注解。

不同配置的 layout 文件转换为 Binding 类的时候，所有 View 都会整合在一起。如果当前 layout 没有的 View 就会被置为 null。

#### layout

    <data>

        <import type="android.location.LocationManager" />

        <variable
            name="status"
            type="android.location.GnssStatus" />
    </data>
    
`<imports>` 导入类，等同于 java

`variables` 声明变量，变量的类型会在编译时检查。

特殊变量：
 
1. view ids
2. content 

#### <include>

Remember to give the include tag an ID or no public field will be given to it.
Variables may be passed into an included layout's binding from the containing layout by **using the application namespace and the variable name in an attribute**:

``` xml
hello_world.xml
<layout xmlns:android="http://schemas.android.com/apk/res/android">
    <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical">

        <TextView
                android:id="@+id/hello"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"/>
        <include
                android:id="@+id/included"
                layout="@layout/included_layout"/>
    </LinearLayout>
</layout>
included_layout.xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">
    <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:id="@+id/world"/>
</layout>
```


### 功能

#### 模型绑定

将 Model 显示到  View 上。

android:text=”@{user.firstName ?? user.userName}”

`@{}` 内的字符串可当成 java 语句取执行。

还可以支持对 dimension 相加，或字符串格式化

    android:padding=”@{@dim/textPadding + @dim/headerPadding}
    android:text=”@{@string/nameFormat(user.firstName, user.lastName)}”
    
##### Views With IDs

A public final field will be generated for each View with an ID in the layout. The binding does a single pass on the View hierarchy, extracting the Views with IDs. This mechanism can be faster than calling findViewById for several Views. For example:

IDs are not nearly as necessary as without data binding, but there are still some instances where access to Views are still necessary from code.


##### Observable Objects

能将 Model 的更新通知到 View。

This is done by assigning a Bindable annotation to the getter and notifying in the setter.

The Bindable annotation generates an entry in the BR class file during compilation. 

可以使用默认的可观察类型（ObservableField）

##### BindingAdapter

如果绑定的值和 View 的 xml 属性不能直接匹配。有两种情况：

1. 有这个属性但绑定的值类型不对。
2. 没有这个属性

比如：

    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:imageUrl="@{product.imageUrl}"/>
            
可以通过 `BindingAdapter` 注解声明一个适配器方法，让 View 的属性和对象类型绑定起来。
            
    @BindingAdapter("imageUrl")
    public static void setImageUrl(ImageView imageView, String url) {
        if (url == null) {
            imageView.setImageDrawable(null);
        } else {
            MyImageLoader.loadInto(imageView, url);
        }
    }
    
BindingAdapter 注解一般用于静态方法。

如果用于实例方法，必须通过构建 DataBindingComponent 类，传入实例方法的实例：

    DataBindingUtil.setDefaultComponent(new android.databinding.DataBindingComponent() {
            public info.dourok.android.demo.gps.GpsDemoActivity getGpsDemoActivity() {
                return GpsDemoActivity.this;
            }
            
[Android Data Binding: Custom Setters – Google Developers – Medium](https://medium.com/google-developers/android-data-binding-custom-setters-55a25a7aea47)

#### 事件绑定

将 View 的事件绑定到方法

Data Binding allows you to write expressions handling events that are dispatched from the views 

1. 监听器对象
   `<View android:onClickListener="@{callbacks.clickListener}" .../>`
   条件： view 设置监听器的方法是`set`开头；clickListener 是一个监听器对象。
   注意：支持 `android:onClickListener`  也支持 `android:onClick`。Listener 后缀会被自动添加
2. Method References，可以单独绑定监听对象中的任意方法，只要返回值和参数列表一致
   `android:onClick="@{handlers::onClickFriend}"`
   条件：方法引用的参数和返回值要一样
   注意：如果 handlers 为空，那么不会设置监听器。
3. Listener Bindings，
   `android:onClick="@{() -> presenter.onSaveClick(task)}"`
   条件：可以单独绑定监听对象中的任意方法，lambda 的参数可以是无参或者监听器方法的所有参数。
   注意：presenter 为空，还是会设置监听器。如果有返回值，会返回 **java 默认值**，比如 false 或者 null
   

   
   
绑定的函数的返回值要和监听器的返回值一样。

##### BindingAdapter

应该放在哪个位置好？

####  双向绑定

View 的属性被用户修改，将修改结果同步到 Model、

    <EditText
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@={user.firstName}"/>


For every 2-way binding, a synthetic event attribute is generated with the same name as the attribute, but with the suffix “AttrChanged.



[Android Data Binding: 2-way Your Way – Google Developers – Medium](https://medium.com/google-developers/android-data-binding-2-way-your-way-ccac20f6313)

    <com.example.myapp.ColorPicker
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:color="@={color}"/>

#### Automatic Setters

很强大，不过刚运行的时候会给 setter 传入空值。

#### Dragger2 


Dragger2 似乎不支持注入 ViewDataBinding

@Component 用于注入的方法似乎可以是任意方法名，一个 Component 可以用于注入多个对象

#### RxJava

RxJava and Android Data Binding both provide mechanisms for subscribing for changes. 
