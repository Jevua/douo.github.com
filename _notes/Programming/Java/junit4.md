---
title: JUnit4
date: '2016-06-16'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---


###  JUnit4

#### 断言

JUnit4 只提供了一些基本的断言给基本类型、对象、数组

- assertArrayEquals;
- assertEquals;
- assertFalse;
- assertNotNull;
- assertNotSame;
- assertNull;
- assertSame;
- assertThat;
- assertTrue;

##### Matcher

junit 提供 `assertThat` 断言，通过 `Matcher` 实现更灵活语义更自然的断言。


`assertThat([value], [matcher statement]);`:

    assertThat(x, is(3));
    assertThat(x, is(not(4)));
    assertThat(responseString, either(containsString("color")).or(containsString("colour")));
    assertThat(myList, hasItem("3"));



##### Hamcrest

Matcher 并不是 JUnit 的类，而是属于 [Hamcrest](https://github.com/hamcrest/JavaHamcrest)。

Hamcrest 提供很多的便利方法，详见 [Wiki](https://code.google.com/archive/p/hamcrest/wikis/Tutorial.wiki)

junit4 也通过 JUnitMatchers 提供一些常用的 Matcher。


Matcher 是一个泛型接口，有一个 matches 方法，判断传入对象是否与当前 Matcher 匹配:

    public interface Matcher<T> extends SelfDescribing {
        ...
        boolean matches(Object item);


以 `assertThat(x, is(3))` 为例，`Is` 是一个简单的 Matcher 只是起到一个装饰作用，`Is` 里面包有一个实际的 Matcher，真正的判断有这个 Matcher 来做。

比如：

    @Factory
    public static <T> Matcher<T> is(T value) {
        return is(equalTo(value));
    }

创建了一个 `IsEqual` Matcher，`IsEqual` 通过构造函数传入期望值，在 `matches` 方法和实际值比对是否相等并返回。




#### Test runner

用来运行测试和显示测试结果


看 `Runner` 的 run 方法，当一个测试的状态发生变化是可以得到通知，Runner 可以根据这些通知更新 ui 或结果集。

    /**
     * Run the tests for this runner.
     *
     * @param notifier will be notified of events while tests are being run--tests being
     * started, finishing, and failing
     */
    public abstract void run(RunNotifier notifier);


通过类注解 `@RunWith(Runner)` 来指明这个测试类的 Runner


##### Suite

`Suite` 也是一个 Test runner，用于跑多个单元测试类

    import org.junit.runner.RunWith;
    import org.junit.runners.Suite;
    
    @RunWith(Suite.class)
    @Suite.SuiteClasses({
      TestFeatureLogin.class,
      TestFeatureLogout.class,
      TestFeatureNavigate.class,
      TestFeatureUpdate.class
    })
    
    public class FeatureTestSuite {
      // the class remains empty,
      // used only as a holder for the above annotations
    }

#### Rules

通过注解将一个对象标记为 TestRule，该对象须实现 `TestRule` 接口， `TestRule` 接口定义了如下方法：

    Statement apply(Statement base, Description description);
    
Statement 我理解为表示一个测试动作，相当于一个 Test 方法的执行。调用 `Statement#evaluate` 表示执行测试。

TestRule 会将 Statement 重新包一层，实现在在测试执行之前或之后插入自己的代码，比如：

    public abstract class ExternalResource implements TestRule {
        public Statement apply(Statement base, Description description) {
            return statement(base);
        }
    
        private Statement statement(final Statement base) {
            return new Statement() {
                @Override
                public void evaluate() throws Throwable {
                    before();
                    try {
                        base.evaluate();
                    } finally {
                        after();
                    }
                }
            };
        }
        ...
    }

具体 junit4 的 rules 见： [Rules · junit-team/junit4 Wiki](https://github.com/junit-team/junit4/wiki/Rules)

    **androidTest 的 Rule 好像不起作用**

#### 异常测试（Exception）

通过注解断言方法会抛出异常

    @Test(expected = IndexOutOfBoundsException.class) 
    public void empty() { 
         new ArrayList<Object>().get(0); 
    }

也可以通过直接的 try-catch

    @Test
    public void testExceptionMessage() {
        try {
            new ArrayList<Object>().get(0);
            fail("Expected an IndexOutOfBoundsException to be thrown");
        } catch (IndexOutOfBoundsException anIndexOutOfBoundsException) {
            assertThat(anIndexOutOfBoundsException.getMessage(), is("Index: 0, Size: 0"));
        }
    }

用 ExpectedException Rule 更灵活功能更强

    @Rule
    public ExpectedException thrown = ExpectedException.none();
    
    @Test
    public void shouldTestExceptionMessage() throws IndexOutOfBoundsException {
        List<Object> list = new ArrayList<Object>();
    
        thrown.expect(IndexOutOfBoundsException.class);
        thrown.expectMessage("Index: 0, Size: 0");
        list.get(0); // execution will never get past this line
    }
    
#### 超时

同时设置超时，可以测试一个方法的执行时间

    @Test(timeout=1000)
    public void testWithTimeout() {
      ...
    }
    
可以通过 Timeout Rule 设置每个方法的超时时间

    @Rule
    public Timeout globalTimeout = Timeout.seconds(10); // 10 seconds max per method tested


#### 忽略一个测试

可以通过注解 `@Ignore` 忽略一个测试

    @Ignore("Test is ignored as a demonstration")
    @Test
    public void testSame() {
        assertThat(1, is(1));
    }

#### 测试执行顺序

JUnit4 可以通过注解 `@FixMethodOrder` 测试方法的执行顺序

#### 参数化测试

预先定义好一系列的注入参数，注入到测试的构造函数或字段，来允许测试。

需要 Test runner `Parameterized`

方法注解 `@Parameters` 用于生成参数

    @Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][] {
                 { 0, 0 }, { 1, 1 }, { 2, 1 }, { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 }  
           });
    }

默认情况下会注入到构造函数的参数列表：

    public FibonacciTest(int input, int expected) {
        fInput= input;
        fExpected= expected;
    }
    

也可以通过 `@Parameter` 注入到字段

    
    @Parameter // first data value (0) is default
    public /* NOT private */ int fInput;

    @Parameter(value = 1)
    public /* NOT private */ int fExpected;

具体见 [Parameterized tests · junit-team/junit4 Wiki](https://github.com/junit-team/junit4/wiki/Parameterized-tests)

#### 假设

[Assumptions with assume · junit-team/junit4 Wiki](https://github.com/junit-team/junit4/wiki/Assumptions-with-assume)

Android Studio 2.1.0
Gradle  2.10
com.android.tools.build:gradle:2.1.0

### Local Unit Tests

与 Android 环境无关的，在本地（PC）环境的 Java 虚拟机内运行的测试。

source sets `src/test/` 

要使用 junit4 需在**模块**的 `build.gradle` 加入依赖，[官方文档][1]写的是 app's top-level `build.gradle` ，我理解成项目的根目录，被坑了不少时间，实际上应该是 app 模块的根目录。

    dependencies {
        testCompile 'junit:junit:4.12'
    }
    
[1]: https://developer.android.com/training/testing/start/index.html#config-local-tests

### Instrumented Tests

source sets  `src/androidTest/`

要使用 junit4 需在**模块**的 `build.gradle` 加入依赖

    dependencies {
        androidTestCompile 'junit:junit:4.12'
    }

unit 

ui

app component integration testing

#### Test Rule

#### Test Runner

需要在 build.gradle 注明：

    android {
        ...
        defaultConfig {
            ...
            testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
        }
    }
 
类注解 `@RunWith(AndroidJUnit4.class)` 这个是可选的，移除掉也能正常允许

### Robolectric

在 jvm 模拟一个 Android 的核心运行环境。解决跑 Instrumented test 需要编译 apk 到 android 设备上运行的问题。
