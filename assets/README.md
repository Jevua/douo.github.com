

### mdl 

#### 滚动问题

##### mdl 与 jquery 的滚动有冲突

```javascript
$('body,html').animate({scrollTop:10000}, 500, "swing");
```

上面的代码是无法触发滚动的。`$('body').height()` 得到是 viewport 的高度。

[html - How can I make header scrollable for smaller screens in MDL? - Stack Overflow](https://stackoverflow.com/questions/31304232/how-can-i-make-header-scrollable-for-smaller-screens-in-mdl) 所说的：

```javascript
$(".mdl-layout__content").animate({scrollTop:position}, speed, "swing");
```

在 header 跟随滚动也就是 `mdl-layout__header--scroll` 下不起作用。fixed header 则没有问题


```javascript
$('.mdl-layout').animate({scrollTop:position}, speed, "swing");
```

能在 header 跟随滚动下起作用。fixed header 不起作用。

##### url hash 不能让页面滚动到指定 id 处

[Direct hash URL does not scroll automatically to the ID · Issue #4726 · google/material-design-lite](https://github.com/google/material-design-lite/issues/4726)

用一个 hack 解决了

##### 刷新页面后无法回到原先的滚动位置

[refreshing page won't remember your scroll position · Issue #1120 · google/material-design-lite](https://github.com/google/material-design-lite/issues/1120#issuecomment-169090777)

暂时不解决。
