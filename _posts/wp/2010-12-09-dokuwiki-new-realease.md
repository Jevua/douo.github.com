---
date: '2010-12-09'
title: dokuwiki新版本"Anteater"支持UTF-8文件名
tags:
- dokuwiki
- FML
- php
- UTF-8
categories:
- coder
meta:
  _edit_last: '1'
  _aioseop_keywords: dokuwiki,dokuwiki新版本,dokuwiki utf-8 fix,dokuwiki 文件名修复,dokuwiki
    utf-8修复
  dsq_thread_id: '796842578'
  _wp_old_slug: dokuwiki_new_realease
postid: '412'
guid: http://dourok.info/?p=412
---
dokuwiki是一款免数据库基于文件的wiki系统，原本其保存文件的命名方式是，对于非ASCII字符的字符用其UTF-8编码按URL编码方式保存。比如一个中文的条目，你看到它保存的文件名可能是
「%E5%A4%9A%E9%87%8D%E5%AF%B9%E6%95%B0%E5%87%BD%E6%95%B0.txt」。
这么一大串实际上只有6个汉字，让人好生不爽呀。

近日整理博客的时候发现，dokuwiki有了新版本「[Anteater](http://www.splitbrain.org/projects/dokuwiki)」，立马换上去。而后，在[EasyBoxLite建站](http://www.easyboxlite.com/index.php?)的[dokuwiki新版本发布
- 2010-11-07
「Anteater」](http://www.easyboxlite.com/index.php?post/2010/11/08/dokuwiki_new_release_2010-11-07_Anteater)上发现，新版的dokuwiki支持用utf-8编码命名文件了，相当给力！这样在FTP上面就可以正确显示出中文文件名，友好多了。在配置管理器页面的**非
ASCII
文件名的编码方法**([fnencode](http://www.dokuwiki.org/config:fnencode))可以做更改，默认的还是原来URL编码，还一个选项是「安全」，这个没有试验过估计dokuwiki用自己的方式对utf8字符再编码，据说比URL编码更短，比UTF8安全，但人不可读的。这也是在说UTF8编码不是安全的，在一些服务器上面可能不能正常工作，比如说我的Win7——文件名是Unicode-16LE编码的；还有我的SSH服务器（CentOS）——没有中文字符集或者说所有非ASCII字符的会变成问号
:?: ，这些服务器都可能会出问题。

还有一点，将文件名的编码设置成utf-8的格式，那些之前用URL编码保存的文件dokuwiki是不会帮你重命名的，也就说之前的写好的wiki条目都访问不了，是很郁闷的一件事啊！于是乎趁php还未手生写了个批量重命名的php脚本。脚本如下：


```php
<?php 
/*  
*  fixfn.php  
*  !!!注意，转换前千万个一定要备份原数据!!!!  
*  跟要修改的data文件夹放在同目录，一般是dokuwiki的根目录。  
*  也可以放在任意位置，但要自己修改dokuwiki的data文件夹位置,在最下面的$ds变量指定  
*  访问执行一次便可。  
*  对文件名里有"%"符号的文件才会有影响  
*  重复运行虽无影响,但运行完还是删了好  
*  如果文件名中"%"出现在不应该出现的地方,那文件名肯定会错乱滴  
*  !!!注意，转换前千万个一定要备份原数据!!!!  
*/
function simpleHexToNum($s){
	$s=strtoupper($s);
	$x = ord($s);
	
    if($x>=ord("0") && $x<=ord("9")){
       return $x-ord('0');
    }
    if($x>=ord('A')&&$x<=ord('F')){
       return $x-ord('A')+10;
    }
    return -1;
}
function toUTF8($str){  //文件名中百分号(%)后面必须跟着两位16进制数才能正常工作  
	$len = strlen($str);
	$result ='';
	$i=0;
	while($i<$len){
		if($str[$i] == "%"){
			$i++;
			$d = simpleHexToNum($str[$i++])*16+simpleHexToNum($str[$i++]); //DIG
			$result =$result . chr($d);
		}else{
			$result =$result . $str[$i++];
		}

	}
	return $result;
}
function rename_data($path){
        if(is_dir($path)){
				echo $path . "<br />";
                $dp=dir($path);
                while($file=$dp->read())
                        if($file!='.'&&$file!='..'){
							//	$nfile = toUTF8($file); //亲测可用  
								$nfile = urldecode($file);   //php自带urldeconde,这个健壮性会好很多吧 ...汗  
								echo "rename <strong>" . $file."</strong> to <strong>" .$nfile . "</strong><br />";
								echo  rename($path."/".$file , $path."/".$nfile)?"<font color=\"#00FF00\">success</font>":"<font color=\"#FF0000\">fail</font>" ;
								echo "<br />";
                                rename_data($path.'/'.$nfile);
						}
                $dp->close();
        }
        
}
echo "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></head>";

//可能要动手修改的地方  
$ds =dirname(__FILE__) . "/data";  //默认同目录下的data文件夹  
//$ds = "/xxxx/dourok.info/wiki/data";  //自己指定data文件夹  
rename_data($ds); 


echo "<font color=\"#FF0000\">if everything running fine,delete this php file</font></html>";
?>
```


对跟我一样只有FTP权限的童鞋应该有帮助，将上面的代码复制下来，保存成php文件如fixfn.php，最好UTF8编码的，上传到服务器，位置见代码注释，访问一下搞定。再次提醒一定得**备份原数据**啊！php菜鸟一个，你们懂的。

突然想来一段FML:
今天，本来是想把dokuwiki的老数据拉到本地系统上来改名的，用Java写好了代码才想起windows文件名不是utf-8，于是乎再将数据跟代码传到我的ssh服务器上，上面有java环境，运行下才发现服务器不支持非ASCII字符，我一早知道又给忘了，无奈只能用php重写，实现了url解码成功改完名后，才发现php有urldecode…FML
