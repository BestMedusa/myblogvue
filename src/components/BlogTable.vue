<style type="text/css" xmlns:text-align="http://www.w3.org/1999/xhtml">
  .blog_table_footer {
    display: flex;
    box-sizing: content-box;
    padding-top: 10px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    justify-content: space-between;
  }
</style>
<template>
  <div>
    <div style="display: flex;justify-content: flex-start">
      <el-input
        placeholder="通过标题搜索该分类下的博客..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="mini">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
    </div>
    <!--<div style="width: 100%;height: 1px;background-color: #20a0ff;margin-top: 8px;margin-bottom: 0px"></div>-->
    <el-table
      ref="multipleTable"
      :data="articles"
      tooltip-effect="dark"
      style="width: 100%;overflow-x: hidden; overflow-y: hidden;"
      max-height="390"
      @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column
        type="selection"
        width="35" align="left" v-if="showEdit || showDelete">
      </el-table-column>
      <el-table-column
        label="标题"
        width="400" align="left">
        <template slot-scope="scope"><span style="color: #409eff;cursor: pointer" @click="itemClick(scope.row)">{{ scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近编辑时间" width="140" align="left">
        <template slot-scope="scope">{{ scope.row.updateTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120" align="left">
      </el-table-column>
      <el-table-column
        prop="cateName"
        label="所属分类"
        width="120" align="left">
      </el-table-column>
      <el-table-column label="操作" align="left" v-if="showEdit || showDelete">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)" v-if="showEdit">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" v-if="showDelete">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="blog_table_footer">
      <el-button type="danger" size="mini" style="margin: 0px;" v-show="this.articles.length>0 && showDelete"
                 :disabled="this.selItems.length==0" @click="deleteMany">批量删除
      </el-button>
      <span></span>
      <div>
        <el-pagination
          background
          :page-sizes="[1, 3, 5, 7]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="currentChange" v-show="this.articles.length>0">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {deleteRequest, putRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  // import Vue from 'vue'
  // var bus = new Vue()

  export default {
    data() {
      return {
        pageSize: 3, //每页显示20条数据
        currentPage: 1, //当前页码
        count: 0, //总记录数
        items: [],
        articles: [],
        selItems: [],
        loading: false,
        totalCount: -1,
        keywords: '',
        dustbinData: []
      }
    },
    mounted: function () {
      this.loading = true;
      this.loadBlogs(1, this.pageSize);
      var _this = this;
      debugger
      window.bus.$on('blogTableReload', function () {
        _this.loading = true;
        _this.loadBlogs(_this.currentPage, _this.pageSize);
      })
    },
    methods: {
      searchClick() {
        this.loadBlogs(1, this.pageSize);
      },
      itemClick(row) {
        this.$router.push({path: '/blogDetail', query: {aid: row.id}})
      },
      deleteMany() {
        var selItems = this.selItems;
        for (var i = 0; i < selItems.length; i++) {
          this.dustbinData.push(selItems[i].id)
        }
        this.deleteToDustBin(selItems[0].state)
      },
      //翻页
      currentChange(currentPage) {
        this.currentPage = currentPage;
        this.loading = true;
        this.loadBlogs(currentPage, this.pageSize);
      },
      //页大小改变
      handleSizeChange(val) {
        this.pageSize = val;
        this.loadBlogs(this.currentPage, this.pageSize);
      },
      loadBlogs(page, count) {
        var _this = this;
        var url = '';
        debugger
        // if (this.state == -2) {
        //   url = "/article/all" + "?page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        // } else {
        //   url = "/article/all?state=" + this.state + "&page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        // }
        url = `/api/article/page?pageSize=${this.pageSize}&pageNo=${this.currentPage}&keywords=${this.keywords}`;
        getRequest(url).then(resp => {
          debugger
          _this.loading = false;
          if (resp.status == 200) {
            if (resp.data.code == '2000') {
              _this.count = resp.data.data.total;
              // _this.categories = resp.data.data.rows;
              // _this.items = resp.data.data.rows
              _this.articles = resp.data.data.rows;
              _this.totalCount = resp.data.data.total;
            }
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp => {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp => {
          //压根没见到服务器
          _this.loading = false;
          _this.$message({type: 'error', message: '未找到服务器!'});
        })
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },
      handleEdit(index, row) {
        this.$router.push({path: '/editBlog', query: {from: this.activeName, id: row.id}});
      },
      handleDelete(index, row) {
        this.dustbinData.push(row.id);
        this.deleteToDustBin(row.state);
      },
      deleteToDustBin(state) {
        var _this = this;
        this.$confirm(state != 2 ? '将该文件放入回收站，是否继续?' : '永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var selItems = _this.dustbinData;
          var ids = '';
          for (var i = 0; i < selItems.length; i++) {
            ids += selItems[i] + ",";
          }
          if (ids.length > 0) {
            ids = ids.substring(0, ids.length - 1);
          }
          _this.loading = true;
          debugger
          var url = '';
          if (_this.state == -2) {
            url = "/admin/article/dustbin";
          } else {
            url = "/api/article/";
          }
          deleteRequest(url + ids).then(resp => {
            if (resp.status == 200 && resp.data.code == 2000) {
              var data = resp.data;
              _this.$message({type: 'success', message: '删除成功!'});
              // if (data.status == 'success') {
              window.bus.$emit('blogTableReload')//通过选项卡都重新加载数据
              // }
            } else {
              _this.$message({type: 'error', message: '删除失败!'});
            }
            _this.loading = false;
            _this.dustbinData = []
          }, resp => {
            _this.loading = false;
            _this.$message({type: 'error', message: '删除失败!'});
            _this.dustbinData = []
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
          _this.dustbinData = []
        });
      }
    },
    props: ['state', 'showEdit', 'showDelete', 'activeName']
  }
</script>
