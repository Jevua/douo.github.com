---
title: 我的笔记
date: 2012-09-11
description:

---


<script>
var tags = [
{{# notes.tags.all }}"{{name}}",{{/ notes.tags.all }} 
];
</script>
{{# javascripts.load }}
  d3.js
  d3.layout.cloud.js
  tagscloud.js				
{{/ javascripts.load }}

<script>
cloud.jump = function(d){moon.jumpToTag(d.text)};
$(cloud.init);
</script>

<div id="tagscloud">
  </div>


### Todo


{{# notes.pendings }}
- [{{ title }}]({{ url }})
{{/ notes.pendings }}


### Drafts

{{# notes.drafts }}
- [{{ title }}]({{ url }})
{{/ notes.drafts }}



### Archives


{{# notes.archives }}
- [{{ title }}]({{ url }})
{{/ notes.archives }}



### Empty

{{# notes.empty }}
- [{{ title }}]({{ url }})
{{/ notes.empty}}
