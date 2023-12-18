<template>
<!-- 轮播图 -->
<div class="home" if="home" name="home">
  <div class="block">
    <el-carousel autoplay height="460px">
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <img style="height:460px;" :src="item" alt="Image" />
      </el-carousel-item>
    </el-carousel>
  </div>
<div class="goods" id="goods" name="goods">
  <!-- 主要内容区 -->
  <div class="main">
        <div class="list">
          <MyList :list="product" v-if="product.length>0"></MyList>
          <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
        </div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            centerbackground
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
</div>
</template>

<script>
export default {
  data() {
    return {
      images: [
      require("../assets/imgs/home1.jpg"),
      require("../assets/imgs/home2.jpg"),
      require("../assets/imgs/home4.jpg")
      ],
      categoryID: [], // 分类id
      product: "", // 商品列表
      productList: "",
      total: 0, // 商品总量
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1 ,//当前页码
      search: '' // 初始化 search 属性
    };
  },
  created(){
    this.getCategory();
  },
  activated(){
    this.total = 0; // 初始化商品总量为0
    this.currentPage = 1; //初始化当前页码为1
    this.categoryID = [];
    this.activeName = "0";
  },
  watch:{
    categoryID: function() {
      this.getData();
      this.search = "";
    },
  },
  methods:{
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
    // 向后端请求全部商品或分类商品数据
    getData() {
      // 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
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
    }

};


</script>

<style scoped>

.goods {
    margin-top: 30px;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    background-color: #f5f5f5;
  }

/* 轮播图CSS */
.block {
  margin-top: 80px;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  max-width: 1050px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 轮播图CSS END */

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

.main-box {
  background-color: #f5f5f5;
  padding-bottom: 20px;
  
}

</style>
