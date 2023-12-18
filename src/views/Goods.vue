<template>
    <div class="goods" id="goods" name="goods">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a @click="refreshPage">全部商品</a>
            </el-breadcrumb-item>
          <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
          <el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 面包屑END -->
  
      <!-- 主要内容区 -->
      <div class="main">
        <div class="list">
          <MyList :list="product" v-if="product.length>0"></MyList>
          <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
        </div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="currentChange"
          ></el-pagination>
        </div>
        <!-- 分页END -->
      </div>
      <!-- 主要内容区END -->
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        categoryList: "", //分类列表
        categoryID: [], // 分类id
        product: "", // 商品列表
        productList: "",
        total: 0, // 商品总量
        pageSize: 15, // 每页显示的商品数量
        currentPage: 1, //当前页码
        activeName: "-1", // 分类列表当前选中的id
        search: "" // 搜索条件
      };
    },
  created() {
    // 获取分类列表
    this.getCategory();
  },
    activated() {
      this.activeName = "-1"; // 初始化分类列表当前选中的id为-1
      this.total = 0; // 初始化商品总量为0
      this.currentPage = 1; //初始化当前页码为1
      // 如果路由没有传递参数，默认为显示全部商品
      if (Object.keys(this.$route.query).length == 0) {
        this.categoryID = [];
        this.activeName = "0";
        return;
      }
      // 如果路由传递了search，则为搜索，显示对应的分类商品
      if (this.$route.query.search != undefined) {
        this.search = this.$route.query.search;
      }
    },
    watch: {
      
      // 监听搜索条件，响应相应的商品
      search: function(val) {
        if (val != "") {
          this.getProductBySearch(val);
        }
      },
    // !!!!监听分类id，响应相应的商品
    categoryID: function() {
      this.getData();
      this.search = "";
    },
      // 监听路由变化，更新路由传递了搜索条件
      $route: function(val) {
        if (val.path == "/goods") {
          if (val.query.search != undefined) {
            this.activeName = "-1";
            this.currentPage = 1;
            this.total = 0;
            this.search = val.query.search;
          }
        }
      }
    },
    methods: {

      // 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
      refreshPage() {
        this.categoryID = [];
      // 初始化商品总量和当前页码
      this.total = 0;
      this.currentPage = 1;
      // 更新地址栏链接，方便刷新页面可以回到原来的页面
      this.$router.push({
        path: "/goods",
        query: { categoryID: this.categoryID }
      });
    },

      // 返回顶部
      backtop() {
        const timer = setInterval(function() {
          const top = document.documentElement.scrollTop || document.body.scrollTop;
          const speed = Math.floor(-top / 5);
          document.documentElement.scrollTop = document.body.scrollTop =
            top + speed;
  
          if (top === 0) {
            clearInterval(timer);
          }
        }, 20);
      },
      // 页码变化调用currentChange方法
      currentChange(currentPage) {
        this.currentPage = currentPage;
        if (this.search != "") {
          this.getProductBySearch();
        } else {
          this.getData();
        }
        this.backtop();
      },
      // 向后端请求分类列表数据
      getCategory() {
        this.$axios
          .post("/api/product/getCategory", {})
          .then(res => {
            const val = {
              category_id: 0,
              category_name: "全部"
            };
            const cate = res.data.category;
            cate.unshift(val);
            this.categoryList = cate;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      // 向后端请求全部商品
      getData() {
        // 请求全部商品数据
        const api = "/api/product/getAllProduct";
        this.$axios
          .post(api, {
            categoryID: this.categoryID,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
          .then(res => {
            this.product = res.data.Product;
            this.total = res.data.total;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      // 通过搜索条件向后端请求商品数据
      getProductBySearch() {
        this.$axios
          .post("/api/product/getProductBySearch", {
            search: this.search,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
          .then(res => {
            this.product = res.data.Product;
            this.total = res.data.total;
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .goods {
    background-color: #f5f5f5;
  }
  /* 面包屑CSS */
  .el-tabs--card .el-tabs__header {
    border-bottom: none;
  }
  .goods .breadcrumb {
    margin-top:60px;
    display: flex;
    align-items: center;
    height: 60px;
    background-color: rgb(255, 255, 255);
  }
  .goods .breadcrumb .el-breadcrumb {
    width: 1225px;
    line-height: 30px;
    font-size: 16px;
    margin: 0 auto;
  }
  /* 面包屑CSS END */
  
  /* 主要内容区CSS */
  .goods .main {
    margin: 0 auto;
    max-width: 1225px;
  }
  .goods .main .list {
    min-height: 650px;
    padding-top: 14.5px;
    margin-left: -13.7px;
    overflow: auto;
  }
  .goods .main .pagination {
    height: 50px;
    text-align: center;
  }
  .goods .main .none-product {
    color: #333;
    margin-left: 13.7px;
  }
  /* 主要内容区CSS END */
  </style>