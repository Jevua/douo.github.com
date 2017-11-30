---
title: Dagger 2
date: '2017-05-15'
description:
---

控制反转（IoC），指的便是类的依赖应该由外部来给，类不应该在自己内部实例化其他类。这个给类所需依赖的动作便叫依赖注入（DI）。

A dependency consumer asks for the dependency(Object) from a dependency provider through a connector.

https://blog.mindorks.com/introduction-to-dagger-2-using-dependency-injection-in-android-part-1-223289c2a01b




### Objects graph


`@Inject` 和 `@Provides` 注解的类形成一个对象图。图的边便是各自的依赖。

main 方法或者 Android 应用/组件 通过一个定义好的根节点集合来访问对象图。这个集合由一个有一系列无参数与返回期望类型的方法列表的接口定义，这个接口由 @Component 注解生成。

如何形成？依赖是什么？

猜想：

1. 如何形成节点：由 @Inject 注解的构造函数，@Module 内的 Provider 方法。用于提供对象。
2. 如何形成边：构造函数的参数，Provider 方法的参数，参数与构造函数的对象之间便有了依赖，Provider 的返回对象和方法的参数对象间也有了依赖。

> The @Inject and @Provides-annotated classes form a graph of objects, linked by their dependencies. Calling code like an application’s main method or an Android Application accesses that graph via a well-defined set of roots. In Dagger 2, that set is defined by an interface with methods that have no arguments and return the desired type. By applying the @Component


引入提供者和消费者的概念

### Inject 注解

- 字段，Dagger 2 不会自动注入字段. 且字段不能是 `private`. 字段所属的类就是依赖的消费者。需要在 @Component 接口定义一个供给方法（返回该类实例），dagger2 才会为该类注入。
- 构造函数，当 dagger 需要这个类的实例时，会从 Inject 注解的构造函数初始化这个对象。With the @Inject annotation for the constructor, we tell Dagger that an object of this class is injectable into other objects. Dagger automatically calls this constructor, if an instance of this class is requested.
- 方法，只能注解实例方法， dagger2 会创建实例后，调用 inject 注解的方法，在对象图中找到合适的参数传递进去。

### Module

Module 一般用于注解类，也可以注解接口。

Module 类用于组织各个 Provide 方法。`@Provide` 注解的方法表示它是一个提供者，他的返回值将会加入 dagger 的对象图中。

#### Provide 

@Inject 注解构造器的类可以是提供者，但还不够：

- 接口不能被构造
- 第三方的类不能被注解
- 构造器可能不够，有些对象需要多几行代码来配置

@Provide 就是为这些特殊情况来产生对象，注解的方法包含三个部分

- 返回值，声明这个 Provider 提供的类型
- 参数，表示创建这个对象需要的依赖
- 方法体，表示具体如何创建这个类型

如果无必要，尽量将 Provide 方法声明为静态方法，避免创建 Module 实例，提高效率。

#### Binds

消费者 A（ServletRequest），提供者 B（HttpServletRequest），B 是 A 的子类，但 dagger 仍不能将 B 提供给 A，所以提供者是不变的（invariable）。

如果我们需要一个一般化的类型，而类图中已经一个该类型的子类，那么用Provide 是这样做的：

```
@Provide
public ServletRequest provideServletRequet(HttpServletRequest httpRequest){
    return httpRequest;
}
```

这显得很没必要。用 Binds 注解可以这么做：

```
@Binds ServletRequest bindServletRequest(HttpServletRequest httpRequest);
```
@Binds 用于注解方法声明，如果 module 是接口，那么 binds 方法就是一个方法声明，如果 module 是类，那么 binds 方法就是一个抽象方法。 binds 方法有且只有一个参数，这个参数可以分配（assignable）给返回类型。

**注意 Module 不能同时用 Binds 方法和 Provide 实例方法**,因为 Binds 方法只是一个方法声明没有实现，一旦有了 Module 有了 Provide 实例方法，意味着这个 Module 必须实例化，所以方法声明就必须得有实现，这便起了冲突。

- [Why can’t @Binds and instance @Provides methods go in the same module?](https://google.github.io/dagger/faq.html#why-cant-binds-and-instance-provides-methods-go-in-the-same-module)
- [Binds](https://google.github.io/dagger/api/latest/dagger/Binds.html)

### Component

Component 像是 Module 和 Inject 之间的桥梁。

猜想：是对象图的部分节点集合，这些节点是入口节点，也可称为根节点

[Component](https://google.github.io/dagger/api/latest/dagger/Component.html)

用于注解接口或抽象类，Dagger 生成的 Component 类将被冠与 Dagger 前缀。比如 `@Component interface MyComponent {...}` 将会生成类 `DaggerMyComponent`。

Component 必须至少有一个方法。Component 的方法有两种类型

1. Provision，Provision 方法没有参数返回值是我们待注入的对象，该对象必须是提供者。Provision methods have no parameters and return an injected or provided type. Each method may have a Qualifier annotation as well. 
2. Member-injection，该方法有一个参数，用于传递待注入的对象，由用户来构造实例。如果该对象不是提供者，那只能通过这种方法来注入。该方法的返回值是可选的，返回值与参数类型系统，主要用于链式调用。

若方法的返回值为 MemboersInjector<T> 如 `MembersInjector<SomeType> getSomeTypeMembersInjector();`，调用 `MembersInjector.injectMembers(T)` 等同于 Component 的成员注入方法。

#### Builder

Component 的实现主要由 @Component.Buidler 来做。一般 Component.Buidler 是由 Dagger 生成的，Builder 将会生成各个 module 和 依赖组件（dependencies Component）的 setter 方法，方法名有 module 或依赖类型的小写驼峰式命名。
如果 Module 有无参构造函数那也可以省略，Dagger 会自动实例化。

``` java
   public static void main(String[] args) {
     OtherComponent otherComponent = ...;
     MyComponent component = DaggerMyComponent.builder()
         // required because component dependencies must be set
         .otherComponent(otherComponent)
         // required because FlagsModule has constructor parameters
         .flagsModule(new FlagsModule(args))
         // may be elided because a no-args constructor is visible
         .myApplicationModule(new MyApplicationModule())
         .build();
   }
```

也可以自己用 @Compoent.Builder 实现，一般注解内部静态抽象类或接口。

[Component.Builder](https://google.github.io/dagger/api/latest/dagger/Component.Builder.html)

#### Subcomponent

Subcomponent 继承其父组件（parent Component/SubComponent）的绑定（bindings）。是组件间关系的一种。

Subcomponent 不再独立生成一个类，而在其父组件中生成实现。

Dagger 2.7 之前，Subcomponents 通过在父组件中声明一个工厂方法来和父组件绑定在一起。

    @Singleton  @Component
    interface ApplicationComponent {
     // component methods...

     RequestComponent newRequestComponent(RequestModule requestModule);
    }

从 2.7 开始，Module 新增一个 subcomponents 可选元素（Optional elements），Subcomponents are declared by listing the class in the Module.subcomponents() attribute of one of the parent component's modules. This binds the Subcomponent.Builder within the parent component.

如下的方式定义一个 Subcomponent，以 Module 方式安装 subcomponent ，`@Subcomponent.Builder` 必须显式声明。

    @Subcomponent
    public interface TestSubComponent {
    
        @Subcomponent.Builder
        abstract class Builder {
            abstract TestSubComponent build();
        }
    }

    @Module(subcomponents = TestSubComponent.class)
    public class BuildModule {
    }
    
然后在父组件中安装该 Module：

    Component(modules = BuildModule.class)
    public interface ParentComponent {...}

接下来就可以通过 DaggerParentComponent 注入 SubComponent.Builder 了或者通过声明供给（provision）方法获取 SubComponent.Builder 对象，可以看到 DaggerParentComponent  里面有如下生成代码：


    private final class TestSubComponentBuilder extends TestSubComponent.Builder {
        @Override
        public TestSubComponent build() {
          return new TestSubComponentImpl(this);
        }
      }
    
      private final class TestSubComponentImpl implements TestSubComponent {
        private TestSubComponentImpl(TestSubComponentBuilder builder) {
          assert builder != null;
        }
      }



在父组件中声明工厂方法还是继续被支持。

> Using @Module.subcomponents is better since it allows Dagger to detect if the subcomponent is ever requested. Installing a subcomponent via a method on the parent component is an explicit request for that component, even if that method is never called

#### dependencies

另一个组件间关系便是依赖，依赖与 subcomponent 不一样的地方在于，subcomponent 是共享父组件的整个对象图。组件间的依赖，只能获取到被依赖组件的供给方法（provision）暴露出来的对象。

上面也提到过，声明了依赖的组件的 Builder 需要提供该依赖的 setter 方法，用于手动传入被依赖的组件。如某个 Comoponent 依赖了 OtherComoponent，这个 Component 会从 OtherComoponent 的供给方法作为提供者加入对象图：

    public Builder otherComponent(OtherComponent otherComponent) {
      this.otherComponent = Preconditions.checkNotNull(otherComponent);
      return this;
    }


### multibinds

将对象绑定到集合中。

供给注解，用于注解 Provider 方法，表示提供的对象会被注入 Set/Map

- Set
   - @IntoSet 将一个元素注入 Set
   - @ElementsIntoSet 将一个集合注入 Set
- Map
   - @IntoMap 表示该方法的返回值作为 Map 的 value 注入 Map 中，另外 Key 由下面的注解提供:
   - @Stringkey 提供字符串作为 key
   -  @IntKey 提供 int
   -  @ClassKey 提供 class 
   -  也可用 `@MapKey` 自定义 key 的类型
   -  key 都是常量

@Multibinds，对于 @Inject 注解的集合，找不到元素的供给的话，dagger 会在编译期报错：

    java.util.Map<java.lang.String,java.lang.String> cannot be provided without an @Provides- or @Produces-annotated method.

如果有在 Module 中声明了 @Multibinds，便不会报错，而是得到一个空集合。


- [Multibindings](https://google.github.io/dagger//multibindings.html)
- [dagger.multibindings](https://google.github.io/dagger/api/latest/dagger/multibindings/package-summary.html)


### @Scope

Scope 注解，只是语法糖的作用，相当于一个约定。

例如使用 Scope 注解 `@ActivityScope` 注解 Component，那么 Component 下的对象只支持未使用 Scope 的绑定，或者使用 `@ActivityScope` 注解的绑定。不然 dagger 就会在编译期报错。

> The component implementation ensures that there is **only one provision of each scoped binding per instance of the component**. If the component declares a scope, it may only contain unscoped bindings or bindings of that scope anywhere in the graph.

注解 Provide 或 Binds，表面声明这些方法的 Modules 只能安装在声明相同 scope 注解的 Component 中。使用 Scope 的方法提供的对象，Component 每次注入都使用相同对象。

> Modules with @Provides methods annotated with a scope may only be installed into a component annotated with the same scope

@Inject 注解的构造函数也是作为对象节点，使用 scope 的意义与 Provides 相同。

> You should although not keep activity or fragment scoped components any place besides in activities or fragments respectively

[java - Dagger 2 scope and subcomponents - Stack Overflow](https://stackoverflow.com/questions/36371716/dagger-2-scope-and-subcomponents)

Scope 注解其他位置，除了起到提示的作用外，没有实际意义。

所以 `@ActivityScope` 起作用的要点，在于每个 Activity 都初始化**一个**  `@ActivityScope`  注解的 Component 实例。Component 就跟 Activity 的生命周期绑定在一起了，使用  `@ActivityScope` 注解的实例就能保证有且只有一个并且跟 Activity 的生命周期绑定在一起。

`@Singleton` 也只是一个普通的 Scope 注解，他也只是起到让 `@Singleton` 注解的 Component 有且只有一个 `@Singleton` 注解的对象。至于确保 Component 是单例还是得自己控制。

#### @Reusable

起到和 Scope 类似的作用，@Resuable 注解的对象，dagger 会缓存起来，Component 及其子 Component 会使用相同的一个缓存对象。

不同于 Scope 绑定到 Component，@Reusable 注解的供给方法或 Module 可以用于多个 Component，不必管 Component 的 Scope。


### Reference


1. Lazy 调用 `Lazy#get` 才实例化对象
2. Provider 解决循环依赖
3. ProviderOfLazy
4. @CanReleaseReferences.

### Dagger Android

dagger 2.10 引进的一个新模块，用于简化 android 中 dagger 的使用。详细例子见：https://android.jlelse.eu/android-and-dagger-2-10-androidinjector-5e9c523679a3

主要通过 AndroidInjector 作为 Subcomponent 来对照 android 中的四大组件和 fragment。主要是提供一个注入方法，因为这些组件都是系统创建的，无法让 dagger2 帮我们创建。

然后利用 multibinds 将各个组件的 Builder，如 Activity 的 Component（Subcomponent） 存放在 AppComopent 中，并注入到 Application。实际使用时 Application 实现 `HasActivityInjector` 接口，保存 `DispatchingAndroidInjector<Activity>` 的实例。在 Activity 通过  `AndroidInjection.inject(this);` 来实现注入，首先找到 Activity 对应的 Subomponent.Builder，保存在 Map 里面，已该 Activity 的类引用为 key，然后创建 Subcomponent 实例也是  AndroidInjector 实例，然后通过其来实现注入。

将本来类似下面的注入代码变成一行搞定：

    ((SomeApplicationBaseType) getContext().getApplicationContext())
            .getApplicationComponent()
            .newActivityComponentBuilder()
            .activity(this)
            .build()
            .inject(this);


最终代码：

    public class YourActivity extends Activity {
      public void onCreate(Bundle savedInstanceState) {
        AndroidInjection.inject(this);
        super.onCreate(savedInstanceState);
      }
    }
    
[Dagger Android](https://google.github.io/dagger//android.html)

实际上，我们在 DeclarationsModule 提供的 FooActivity 绑定，会通过 AndroidInjectionModule 的 @Multibinds 绑定到一个以 Activity.class 为 key 的 Map 中。这个 Map 会最终绑定到 DispatchingAndroidInjector 中。DispatchingAndroidInjector 我们已经在 Application 声明注入。

`@ContributesAndroidInjector` 这个注解可以办我们自动生成，相应的 Subcomponent 和 builder 及绑定方法，对于很多 Activity 只是需要和 Application 共享对象图，自身没必要声明一个 Subcomponent 来说很有用，减少代码。

      @ContributesAndroidInjector
      abstract ChatActivity contributeChatActivityInjector();

#### 问题

SubComponent 如果需要 Module 实例怎么办？

以注入 `RxPermissions` 为例，有多个 Activity 都需要 `RxPermissions` 实例，为了避免每个 Activity 都要定义一个 Module 提供各自的 `RxPermissions` 实例。所以把他放入一个所有 Activity 都通用的 Module。

RxPermissions 需要一个当前 Activity 的引用。可以作为依赖声明在 Provides 方法的参数。

    ActivityModule{
    
        @Provides
        @ActivityScope
        public static RxPermissions provideRxPermissions(Activity ctx) {
            return new RxPermissions(ctx);
        }
    }

也可以作为 Module 实例的字段传入，但这样便需要实例化 Module 并传入 Activity 的引用

    ActivityModule{
    
        private Activity ctx;
    
        @Provides
        @ActivityScope
        public RxPermissions provideRxPermissions() {
            return new RxPermissions(ctx);
        }
    }

但是 dagger android 不支持实例 module。

所以，只能用第一种方法。因为 LoginActivity 已经在对象图里面，但是 dagger android 不能转换 LoginActivity 到 Activity。必须声明一个 Binds

    @Module
    interface LoginActivityModule {
        @Binds
        @ActivityScope
        Activity bindActivity(LoginActivity activity);
    }


Fragment 复用问题


