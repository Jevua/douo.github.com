---
title: 常用代码片段
date: '2013-01-19'
description:
---

### Macros

见我个人使用的[Macros](https://gist.github.com/4290607) 。


### 关闭键盘

在UIView或UIViewController中触摸文本框的其它区域，将关闭键盘结束编辑

```
// 在UIView 或 UIViewController中重写touchesBegan
-(void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self endEditing:YES];

}
```

### 键盘动画


```
// 在block中更改 frame 将跟键盘的动画同步
// kbSize 弹出键盘的具体尺寸
+ (void)animateWithKeyBoardForNotification:(NSNotification *)note block:(void (^)(CGSize kbSize))block
{
    NSDictionary* userInfo = [note userInfo];
    NSTimeInterval animationDuration;
    UIViewAnimationCurve animationCurve;
    [[userInfo objectForKey:UIKeyboardAnimationCurveUserInfoKey] getValue:&animationCurve];
    [[userInfo objectForKey:UIKeyboardAnimationDurationUserInfoKey] getValue:&animationDuration];
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:animationDuration];
    [UIView setAnimationCurve:animationCurve];
    NSDictionary* info = [note userInfo];
    CGSize kbSize = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    block(kbSize);
    
    [UIView commitAnimations];
}

//调用的例子
- (void)keyboardDidShow:(NSNotification *)note
{

    [Global animateWithKeyBoardForNotification:note block:^(CGSize kbSize) {
        self.view.center = CGPointMake(originalCenter.x, originalCenter.y-kbSize.y);
    }];
}
```

### OHAttributedLabel

