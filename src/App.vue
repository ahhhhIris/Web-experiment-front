<template>
  <div id="app" name="app">
    <el-container>
      <el-header>
        <!-- 顶部导航栏 -->
        <div class="topbar">
          <div class="nav">
            <ul>
              <li v-if="!this.$store.getters.getUser">
                <el-button type="text" @click="login">登录</el-button>
                <span class="sep">|</span>
                <el-button type="text" @click="register = true">注册</el-button>
              </li>
              <li v-else>
                欢迎 {{ this.$store.getters.getUser.userName }}
                <span class="sep">|</span>
                
                
        
                <el-button type="text" @click="logoutVisible = true">退出</el-button>
                <el-popover placement="top" width="180" v-model="logoutVisible">
                  <p>确定退出登录吗？</p>
                  <div style="text-align: right; margin: 10px 0 0">
                    <el-button size="mini" type="text" @click="logoutVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="logout">确定</el-button>
                  </div>
                </el-popover>

                <span class="sep">|</span>
                <el-button type="text" @click="deleteVisible = true">注销</el-button>
                <el-popover placement="top" width="180" v-model="deleteVisible">
                  <p>确定注销用户吗？</p>
                  <div style="text-align: right; margin: 10px 0 0">
                    <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteUsr">确定</el-button>
                  </div>
                </el-popover>

              </li>
              <li>
                <router-link to="/order">我的订单</router-link>
              </li>
              <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
                <router-link to="/shoppingCart">
                  <i class="el-icon-shopping-cart-full"></i> 购物车
                  <span class="num">({{getNum}})</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- 顶栏容器 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#409eff"
          router
        >
          <div class="logo">
            <router-link to="/">
              <img src="./assets/imgs/logo222.jpg" height="80" width="220" alt />
            </router-link>
          </div>

          <el-menu-item class="menu-item" index="/">首页</el-menu-item>
          <el-menu-item class="menu-item" index="/goods">全部商品</el-menu-item>

          <div class="so">
            <el-input placeholder="请输入搜索内容" v-model="search">
              <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
          </div>
        </el-menu>
      </el-header>
      <!-- 顶栏容器END -->
      
      <!-- 登录模块 -->
      <MyLogin></MyLogin>
      <!-- 注册模块 -->
      <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

      <!-- 主要区域容器 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <!-- 主要区域容器END -->

      <!-- 底栏容器 -->
      <el-footer>
        <div class="footer">
          <div class="ng-promise-box">
            <div class="ng-promise">
              <p class="text">
                <a class="icon1" href="javascript:;">7天退货 15天换货</a>
                <a class="icon2" href="javascript:;">48元起全场免邮</a>
                <a class="icon3" style="margin-right: 0" href="javascript:;">100%品质保证</a>
              </p>
            </div>
          </div>
          <div class="mod_help">
            <p>首页
              <span>|</span>
              全部商品
              <span>|</span>
              关于我们
            </p>
            <p class="coty">商城版权所有 &copy; Iris 2023</p>
          </div>
        </div>
      </el-footer>
      <!-- 底栏容器END -->


    </el-container>
  
  </div>  
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
 export default {
  beforeUpdate() {
    this.activeIndex = this.$route.path;
  },
    data() {
      return {
        activeIndex: "", // 头部导航栏选中的标签
        search: "", // 搜索条件
        register: false, // 是否显示注册组件
        logoutVisible: false, // 是否退出登录
        deleteVisible: false, // 是否注销用户
      };
    },
    created(){
      // 获取浏览器localStorage，判断用户是否已经登录
    if (localStorage.getItem("user")) {
      // 如果已经登录，设置vuex登录状态
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
    },
    // 用于定义计算属性。计算属性可以根据其他数据的变化来动态计算新的值。
    computed: {
    ...mapGetters(["getUser", "getNum"])
    },
    watch:{
       // 获取vuex的登录状态
    getUser: function(val) {
      if (val === "") {
          // 用户没有登录
          this.setShoppingCart([]);
        } else {
          // 用户已经登录,获取该用户的购物车信息
          this.$axios
            .post("/api/user/shoppingCart/getShoppingCart", {
              user_id: val.user_id
            })
            .then(res => {
              if (res.data.code === "001") {
                // 001 为成功, 更新vuex购物车状态
                this.setShoppingCart(res.data.shoppingCartData);
              } else {
                // 提示失败信息
                this.notifyError(res.data.msg);
              }
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
      }
    },
    methods: {
      ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
      login() {
        // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
        this.setShowLogin(true);
      },
      deleteUsr(){
        this.$axios
              .post("/api/users/logout", {
                userName: this.$store.getters.getUser.userName,
              })
              .then(res => {
                // “001”代表注册成功，其他的均为失败
                if (res.data.code === "001") {
                  this.deletevisible = false;
                  // 清空本地登录信息
                  localStorage.setItem("user", "");
                  // 清空vuex登录信息
                  this.setUser("");
                  this.notifySucceed("成功退出登录");
                  // 弹出通知框提示注册成功信息
                  this.notifySucceed(res.data.msg);
                } else {
                  // 弹出通知框提示注册失败信息
                  this.notifyError(res.data.msg);
                }
              })
              .catch(err => {
                return Promise.reject(err);
              });
      },
      // 退出登录
      logout() {
        this.logoutvisible = false;
        // 清空本地登录信息
        localStorage.setItem("user", "");
        // 清空vuex登录信息
        this.setUser("");
        this.notifySucceed("成功退出登录");
      },
      // 接收注册子组件传过来的数据
      isRegister(val) {
        this.register = val;
      },
      // 点击搜索按钮
      searchClick() {
        if (this.search != "") {
          // 跳转到全部商品页面,并传递搜索条件
          this.$router.push({ path: "/goods", query: { search: this.search } });
          this.search = "";
        }
      }
    }
  }

</script>

<style>
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  max-width: 1600px;
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */

/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1400px;
  margin: 0 auto;
}
.el-header .logo {
  height: 80px;
  width: 80px;
  float: left;
  margin-right: 150px;
}
.el-header .so {
  margin-top: 30px;
  width: 500px;
  float: right;
}

.el-header .el-menu .menu-item {
  height: 80px;
  color: #333; /* 设置文本颜色为黑色 */
  font-size: 18px; /* 设置字体大小为18像素 */
  padding: 20px; /* 设置内边距为10像素 */
  max-width: 1225px;
  margin-left: 15px;
}

.el-header .el-menu .menu-item.is-active {
  background-color: #fff; /* 设置活动状态的背景颜色为蓝色 */
  color: #409eff; /* 设置活动状态的文本颜色为白色 */
}


/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p .icon1{
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./assets/imgs/us-icon1.png") no-repeat left 0;
}

.footer .ng-promise-box .ng-promise p .icon2{
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./assets/imgs/us-icon2.png") no-repeat left 0;
}

.footer .ng-promise-box .ng-promise p .icon3{
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("./assets/imgs/us-icon3.png") no-repeat left 0;
}

.footer .ng-promise-box .ng-promise p a:hover {
  color: #db5f13; /* 设置悬浮时的链接文本颜色为橙色 */
}


.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底栏容器CSS END */
</style>