# 用户中心

## 项目目标

完整了解做项目的流程和思路分析，接触一些企业级的开发技术， 快速搭建项目的前后端基本框架。

## 项目流程

需求分析 => 设计（概要设计、详细设计）=> 技术选型 =>

初始化 / 引入需要的技术 => 写 Demo => 写代码（实现业务逻辑） => 测试（单元测试）=> 代码提交 / 代码评审 => 部署=> 发布

## 需求分析

1. **登录 / 注册**
2. **用户管理（仅管理员可见）对用户的查询或者修改**
3. 用户校验（ **仅星球用户** ）

## 技术选型

前端：三件套 + React + 组件库 Ant Design + Umi + Ant Design Pro（现成的管理系统）



后端：

- java
- spring（依赖注入框架，帮助你管理 Java 对象，集成一些其他的内容）
- springmvc（web 框架，提供接口访问、restful接口等能力）
- mybatis（Java 操作数据库的框架，持久层框架，对 jdbc 的封装）
- mybatis-plus（对 mybatis 的增强，不用写 sql 也能实现增删改查）
- springboot（**快速启动** / 快速集成项目。不用自己管理 spring 配置，不用自己整合各种框架）
- junit 单元测试库
- mysql

部署：服务器 / 容器（平台）

## 计划

1. 初始化项目

   1. 前端初始化     20 min

      1. 初始化项目 ✔
      2. 引入一些组件之类的 ✔
      3. 框架介绍 / 瘦身 ✔

   2. 后端初始化  20 min

      1. 准备环境（MySQL 之类的）验证 MySQL 是否安装成功 - 连接一下 ✔
      2. 初始化后端项目，引入框架（整合框架）✔

      

2. **登录 / 注册** 

   1. 前端
   2. 后端

3. 用户管理（仅管理员可见）

   1. 前端
   2. 后端





## 笔记



三种初始化 Java 项目的方式

1. GitHub 搜现成的代码
2. SpringBoot 官方的模板生成器（https://start.spring.io/）
3. 直接在 IDEA 开发工具中生成  ✔

如果要引入 java 的包，可以去 maven 中心仓库寻找（http://mvnrepository.com/）

## 数据库设计

用户表：

id(主键)： bigint

userAccount  varchar 账号

userName:昵称 varchar

avatarUrl: 头像 varchar

gender: 性别 tinyint

password: 密码 varchar

phone: 电话 varchar

email：邮箱 varchar

userStatus  用户状态 （比如被封号）tinyint 0 1



createTime 创建时间 （数据创建时间） datetime

updateTime 更新时间  （数据更新时间） datetime

idDelete 是否删除  0 1（逻辑删除） tinyint（在配置文件有说明并在实体字段上加@TableLogic 注解，表示逻辑删除字段）

```
username
userAcco
avatarUr
gender  
userPass
phone   
createTi
updateTi
userStat
isDelete
email   
userRole
```

```mysql
create table user
(
    id           bigint                             not null
        primary key,
    username     varchar(256)                       null comment '用户昵称',
    userAccount  varchar(256)                       null comment '账号',
    avatarUrl    varchar(1024)                      null comment '用户头像',
    gender       tinyint                            null comment '用户性别',
    userPassword varchar(512)                       null comment '用户密码',
    phone        varchar(512)                       null comment '电话',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    userStatus   int      default 0                 null comment ' 用户状态 0 - 正常 ',
    isDelete     tinyint  default 0                 null comment '是否删除',
    email        varchar(512)                       null comment '邮箱',
    userRole     int      default 0                 null
)
    comment '用户表';
```



## 登录注册

### 后端

1. 实现基本的数据库操作（操作user表）

2. 模型user对象 => 和数据库的关系

3. 使用自动生成器（mybatisX插件），自动根据数据库生成domain实体对象、mapper（操作数据库得对象）、mapper.xml(定义了mapper对象和数据库关联，可以在里面写SQL)、service（包含常用得增删改查）、service实现

4. 新增内容：

   新增获取用户的登录态（session中取出），**获取当前登录用户信息接口**

#### 注册逻辑

1. 用户在前端输入账户和密码，以及校验码（todo）

2. 校验用户的账户、密码、校验密码是否符合规则
   1. 账户名**不小于**6位
   2. 密码**不小于**8位
   3. 账户名不能重复
   4. 账户不包含特殊字符
   5. 密码和校验密码必须相同

3. 对密码进行**加密**（密码 **一定** 不能明文存储到数据库中）

   使用spring自带的 `DigestUtils.md5DigestAsHex(userPassword.getBytes());`

4. 向数据库插入用户数据

#### 登录逻辑

1. **请求响应**

   > 接收参数：账号、密码
   >
   > 请求类型：POST（请求参数可能会很长时不建议用GET）       
   >
   > 请求体：JSON 格式的数据
   >
   > 返回值：用户信息（**脱敏**）

2. **逻辑**

   1. 校验密码是否输入正确，跟数据库中的账户名和密码去比对(格式校验与注册相同)
   2. 返回脱敏后的用户信息,防止数据库中的字段泄露给前端
   3. 记录用户的登录态（session），将其保存在服务器上（用后端Springboot框架封装的服务器tomcat去保存）
   4. 返回脱敏后的用户信息

   
   
   #### 控制层 Controller 封装请求
   
   application.yml 指定接口全局 api
   
   > ```yml
   > servlet:
   >   context-path: /api
   > ```
   
   
   
   > @RestController 适用于编写 restful 风格的 api，返回值默认为 json 类型
   
   controller 层倾向于对请求体参数的校验，不涉及业务逻辑本身（越少越好）
   
   service 层是对业务逻辑的校验（有可能被 controller 之外的类调用）
   
   
   
   > 如何知道是哪个用户登录了？
   >
   > 1. 连接服务器端后，得到一个session1 状态，返回给前端
   > 2. 登录成功后，得到了登录成功的session，在该session中保存相应的变量，（比如用户信息）返回给前端一个设置cookie的“信号”
   > 3. 前端收到后端的“信号”，设置cookie，保存到浏览器中
   > 4. 前端再次请求的时候（相同的域名），在请求头中携带cookie去请求
   > 5. 后端拿到前端传来的cookie，就能找到对应的session
   > 6. 后端从该session中可以取出基于该session存储的变量（用户的登录信息、登录名）



#### 用户管理

> 写接口之前一定要鉴权！！！至少在业务当中进行身份的判断，鉴权时需要添加一个userRole字段到数据库中（0-普通用户  1-管理员）

1. 查询用户

   1. 根据用户名查询

      先鉴权（只有管理员才能查询），有权限就返回脱敏后的用户列表

   2. 根据id删除用户（mybatisplus的remove方法默认是逻辑删除）

      先鉴权（只有管理员才能删除），无权限直接返回false



### 前端

修改前端样式

删除多余代码



#### 前后端交互

前端需要向后端发送请求

1. ajax来请求后端
2. axios封装了ajax
3. request是ant design又封装了一次
4. 追踪request源码，用到了umi插件，requestConfig是一个配置



#### 代理

正向代理：替客户端向服务器发送请求

反向代理：替服务器接收来自客户端的请求

怎么搞代理？

Nginx 服务器

Node.js 服务器



### 注册功能前端开发

复制登录组件代码直接用，修改组件名称为Register

设置注册路由：（config包下的routes.ts文件中添加注册路由）

```js
path: '/user',
        layout: false,
        routes: [
            {
                path: '/user', routes: [
                    {name: '登录', path: '/user/login', component: './user/Login'},
                    {name: '注册', path: '/user/register', component: './user/Register'}
                ]
            },
            {component: './404'},
        ],
```

但是，发现地址栏路径为/user/register时，页面会自动跳转到登录页面，检查发现在app.tsx中有拦截的逻辑，即当前用户没有登录时跳转到登录页面，修改后：

```js
const { location } = history;
  const whiteList = ['/user/register', loginPath];
  if(whiteList.includes(location.pathname)) {
    return;
  }
  // 如果没有登录，重定向到 login
  if (!initialState?.currentUser && location.pathname !== loginPath) {
    history.push(loginPath);
  }
},
```

接下来是对注册页面的修改

### 前端代码瘦身优化





### 项目扩展思路

