

  magick mogrify  -verbose  -resize '2048>' -strip -quality 92 *

对当前目录下的照片进行批量处理，`-strip` 移除元数据，`-resize 2048>` 等比将长边缩放至 2048，`-qaulity 92` 调整图片资料。`*` 通配符匹配，可以是 `*.jpg`。`mogrify` 会直接替换原图片。

