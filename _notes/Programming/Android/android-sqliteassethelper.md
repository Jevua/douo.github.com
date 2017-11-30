---
title: Android SQLiteAssetHelper
date: '2013-08-15'
description:
type: draft
---

[Android SQLiteAssetHelper][1] 通过 assets 文件来管理数据库的创建和升级。

### 创建

`assets/databases/northwind.zip` 解压后是 db 文件。

    public class MyDatabase extends SQLiteAssetHelper {
    
        private static final String DATABASE_NAME = "northwind";
        private static final int DATABASE_VERSION = 1;
    
        public MyDatabase(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);  
        }
    }

### 升级

如果改变了数据表结构，需要更新 DataBaseHelper 的 DATABASE_VERSION 字段

并在 assets/databases 里提供升级脚本，如：

	northwind_upgrade_1-2.sql

如果跨度大于一，需考虑为每个版本提供升级脚本，如

	northwind_upgrade_1-3.sql
	northwind_upgrade_2-3.sql


