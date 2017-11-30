---
title: Fragment
date: 2013-11-15'
description:
---



### Fragment

[Fragment.java](http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.3_r2.1/android/support/v4/app/Fragment.java)

#### 构造一个 Fragment

Fragment 有一个无参的构造函数，但是构造一个Fragment不用这个方法（Android 内部只用这个方法来实例化 Fragment），而是用 `Fragment.instantiate`，子类 Fragment 不要实现其他有参数的构造函数，作为代替使用基于 Bundle 的 Arguments 机制。Arguments 可以在 Fragment 重新实例化的时候恢复。Fragment 需要保存的成员变量也都需要放到 Arguments 中。

 Every fragment must have an empty constructor, so it can be instantiated when restoring its activity's state. It is strongly recommended that subclasses do not have other constructors with parameters, since these constructors will not be called when the fragment is re-instantiated; instead, arguments can be supplied by the caller with setArguments(android.os.Bundle) and later retrieved by the Fragment with getArguments().


#### 生命周期

onInflate typically from setting the content view of an activity. This may be called immediately after the fragment is created from a <fragment> tag in a layout file. Note this is before the fragment's onAttach(android.app.Activity) has been called; 

##### 在 layout 中的 fragment

##### 在 Activity 运行时创建的 fragment

#### 状态持久化机制

FragmentState

SavedState

#### Target Fragment 机制

类似于 startActivityForResult，不过是针对 Fragment 的。

Fragment 本身有 `startActivityForResult(Intent intent, int requestCode)`，这个方法封装了 Activity 的相同方法。同时也封装了`onActivityResult`，在 Fragment 里面完成整个过程（FragmentActivity 利用 requestCode 的前16位来标识哪个 Fragment 调用的）。


#### Parent 机制

Fragment 可能依附于 Actvitiy 也可能依附于 Parent Fragment

mChildFragmentManager

#### LoaderManager

#### Menu


### FragmentActiviy

利用了 NonConfigurationInstances 



### FragmentManager

moveToState

noteStateNotSaved


	Handle onNewIntent() to inform the fragment manager that the state is not saved. If you are handling new intents and may be making changes to the fragment state, you want to be sure to call through to the super-class here first. Otherwise, if your state is saved but the activity is not stopped, you could get an onNewIntent() call which happens before onResume() and trying to perform fragment operations at that point will throw IllegalStateException because the fragment manager thinks the state is still saved.

execPendingActions

#### Add Fragment

添加 Fragment 到 mActive 和 mAdd

mActive 保存当前激活的 Fragment，mAvailIndices 保存 mActive 中可用的 index，下次 makeActive 的时候优先使用中间可用的 index。

mAdded 保存所有已添加的 Fragment

#### Replace Fragment

移除掉所指定容器内的所有 Fragment，替换成当前传入的 Fragment。若传入的 Fragment 为空则移除掉所有容器内的 Fragment

#### Remove Fragment

移除 Fragment，如果 Fragment 没有在 BackStack 中，那将 Fragment 状态置于 INITIALIZING，如果是在 BackStack 中等待恢复，那将状态置为 CREATED。

#### Hide Fragment

将 Fragment 中 View 的 Visibility 设置为  Gone，同时调用 onHiddenChanged 方法。重复调用无影响。

#### Show Fragment

将 Fragment 中 View 的 Visibility 设置为  Visible，同时调用 onHiddenChanged 方法。重复调用无影响。

#### Attach Fragment

添加 Fragment 到 mAdded，将 Fragment 的状态转移到当前 FM 的状态。重复调用无影响，只用 mDetached = true 时才会执行。

#### Detach Fragment

从 mAdded 中移除 Fragment，将 Fragment 的状态转移到 CREATED。

#### BackStackEntry 


#### FragmentTransaction

 **A fragment transaction can only be created/committed prior to an activity saving its state. If you try to commit a transaction after FragmentActivity.onSaveInstanceState() (and prior to a following FragmentActivity.onStart or FragmentActivity.onResume(), you will get an error.** This is because the framework takes care of saving your current fragments in the state, and if changes are made after the state is saved then they will be lost.


- add
- replace

##### BackStackRecord

FragmentTransaction 的实现

Op 一次操作



#### FragmentTransactions & Activity State Loss

http://www.androiddesignpatterns.com/2013/08/fragment-transaction-commit-state-loss.html



- Be careful when committing transactions inside Activity lifecycle methods.
- Avoid performing transactions inside asynchronous callback methods.
   必須要用的話也沒有什麼好辦法，嘗試用 commitAllowingStateLoss


     "If framwework have some design limitation, this is your (developer) problem, not the framework's". :) Sure, it's my (and maybe wrong) opinion.
     --	Vladimir Kuts


在 Activity 中实现这个机制， 模擬 FragmentManager 的行為 在 state saved 的時候暫存 Transaction 待下次恢復時再提交。


	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		mUnCommit = new LinkedList<FragmentTransaction>();
		mStateSaved = false;
	}

	@Override
	protected void onStart() {
		super.onStart();
		mStateSaved = false;
	}
	@Override
	protected void onResume() {

		super.onResume();
		mStateSaved = false;
	}

	@Override
	protected void onStop() {
		super.onStop();
		mStateSaved = true;
	}

	@Override
	protected void onDestroy() {
		mUnCommit.clear();
		super.onDestroy();
	}


    protected LinkedList<FragmentTransaction> mUnCommit;
    	protected boolean mStateSaved;
    
    	protected void onResumeFragments() {
    		d("onResumeFragments");
    		super.onResumeFragments();
    		while (!mUnCommit.isEmpty()) {
    			FragmentTransaction ft = mUnCommit.removeFirst();
    			ft.commit();
    		}
    	};
    
    	/**
    	 * 模擬 FragmentManager 的行為 在 state saved 的時候暫存 Transaction 待下次恢復時再提交 當
    	 * Transaction 發生在回調時，用這個方法提交避免發生 IllegalStateException
    	 * 
    	 * @param ft
    	 * @return commit 不能正確執行時返回false
    	 */
    	protected boolean commit(FragmentTransaction ft) {
    		try {
    			if (!mStateSaved) {
    				ft.commit();
    			} else {
    				mUnCommit.addLast(ft);
    			}
    			return true;
    		} catch (IllegalStateException ex) {
    			return false;
    		}
    	}


!#TODO fragment的retainInstance属性值默认为false。这表明其不会被保留。因此，设备旋转时
fragment 会 随 托 管 activity 一 起 销 毁 并 重 建 。 调 用 setRetainInstance(true) 方 法 可 保 留
fragment。已保留的fragment不会随activity一起被销毁。相反，它会被一直保留并在需要时原封
不动的传递给新的activity。

设备配置发生改变时，FragmentManager首先销毁队列中的fragment的视图。在设备配置改
变时,总是销毁与重建fragment与activity的视图，都是基于同样的理由：新的配置可能需要新的资
源来匹配；当有更合适的匹配资源可以利用时，则需重新创建视图。 
紧接着，FragmentManager检查每个fragment的retainInstance属性值。如属性值为false
（初始默认值），FragmentManager会立即销毁该fragment实例。随后，为适应新的设备配置，新
activity的新FragmentManager会创建一个新的fragment及其视图，如图14-1所示。 
 
图14-1  设备旋转与默认不保留的UI fragment 
如属性值为true，则该fragment的视图立即被销毁，但fragment本身不会被销毁。为适应新
的设备配置，当新的activity创建后，新的FragmentManager会找到被保留的fragment，并重新创
建它的视图，如图14-2所示。 
