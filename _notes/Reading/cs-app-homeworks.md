---
title: CS:APP Homeworks
date: '2016-03-03'
description:
widgets :
  math :
    enable : true
type: draft ## 移除这个字段，笔记才会公开发布
---

#### 第二章

##### 2.58

```
#include <stdio.h>
typedef unsigned char *byte_pointer;
const char ONE = 0x01;
int is_little_endian(){
  int t = 0x1; // 0x00000001,
  //little endian: 01 00 00 00
  //big endian 00 00 00 01
  byte_pointer start =(byte_pointer) &t;
  if(start[0] == ONE){ //
    return 1;
  }else{
    return 0;
  }
}

int main(int argc, const char* argv[]){
  printf(is_little_endian()?"is little endian":"is big endian");
  printf("\n");
}
```

##### 2.59

`(0xFFFFFF00&y)|(0xFF&x)`

##### 2.60

```
#include <stdio.h>
unsigned put_byte(unsigned x, unsigned char b, int i){
  int shift_val = i<<3;
  int pre_x = x&(~(0xFF<<shift_val));
  int pre_b = (0x0|b)<<shift_val;
  return pre_b|pre_x;
}

int main(){
  printf("%.8x\n",put_byte(0x12345678,0xAB,2));
  printf("%.8x\n",put_byte(0x12345678,0xAB,0));
}
```

#### 第六章

##### 6.23

磁道的位数大小 b 正比于磁道的周长，磁道的数量 t 取决于可用的盘面半径。磁盘的容量 C = b*t

```mathjax
b=2\pi xr;\\
t=r-xr=r(1-x);\\
C=bt=2\pi r^2(x-x^2);\\
C'=-2\pi r^2(1-2x);\\
C'=0 可解得 x=\frac{1}{2}.\\

```

##### 6.24

```mathjax
T_{access}=T_{avgseek}+T_{avg rotation}+T_{avg transfer}\\
T_{avg rotation} = \frac{1}{RPM}\times \frac{60 secs}{1 min}\\
T_{avg transfer} = \frac{1}{RPM}\times\frac{1}{平均扇区数/磁道}\times\frac{60 secs}{1 min}\\
T_{access}=T_{avg seek}+\frac{1}{RPM}\times \frac{60 secs}{1 min}\times(1+\frac{1}{平均扇区数/磁道})\\
T_{access}=3ms+\frac{1}{12000ms}\times \frac{60 secs}{1 min}\times(1+\frac{1}{500})\\
T_{access}=5.51ms
```

##### 6.25

```mathjax
3mb=3*1000*1kb=6000sector\\
每条磁道 500 个扇区总共需要 12 条磁道\\
T_{best}=T_{avg seek}+T_{avg rotation}+12\times T_{max rotation}\\
T_{rand}=6000\times(T_{avg seek}+T_{avg rotation}+T_{avg transfer})\\
```
