<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入栏目名称"
        v-model="cateName" style="width: 200px;">
      </el-input>
      <el-button type="primary" size="medium" style="margin-left: 10px" @click="addNewCate">新增栏目</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="categories"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column
          type="selection"
          width="55" align="left">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="栏目名称"
          prop="cateName"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          prop="date"
          label="启用时间" align="left">
          <template slot-scope="scope">{{ scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" :disabled="this.selItems.length==0" style="margin-top: 10px;width: 100px;"
                 @click="deleteAll" v-if="this.categories.length>0">批量删除
      </el-button>
      <template>
        <div class="pager">
          <select style="/*font-size: 14px;*/position: relative;padding: 6px 12px;" v-model="pageSize" @change="pageChange(currentPage)">
            <option v-for="item in pageSizes" :value="item">{{item}}条/页</option>
          </select>
          <mo-paging
            :page-index="currentPage"
            :total="count"
            :page-size="pageSize"
            @change="pageChange">
          </mo-paging>
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<script>
  import {postRequest} from '../utils/api'
  import {putRequest} from '../utils/api'
  import {deleteRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  import MoPaging from '../utils/paging'

  export default {
    components: {
      MoPaging
    },
    data() {
      return {
        pageSize: 3, //每页显示5条数据
        currentPage: 1, //当前页码
        count: 0, //总记录数
        items: [],
        pageSizes: [1,3,5],
        cateName: '',
        selItems: [],
        categories: [],
        loading: false
      }
    },
    methods: {
      //获取数据
      getList() {
        //模拟
        let _this = this;
        let url = `/api/category/page?pageSize=${this.pageSize}&pageNo=${this.currentPage}`;
        getRequest(url).then(resp => {
          // this.$http.get(url)
          //   .then(({resp}) => {

          //子组件监听到count变化会自动更新DOM
          _this.count = resp.data.data.total;
          _this.categories = resp.data.data.rows;
          _this.items = resp.data.data.rows
        })
      },

      //从page组件传递过来的当前page
      pageChange(page) {
        this.currentPage = page;
        this.getList()
      },
      addNewCate() {
        this.loading = true;
        var _this = this;
        postRequest('/api/category/add', {cateName: this.cateName}).then(resp => {
          if (resp.status == 200) {
            var json = resp.data;
            if (json.code == 2000) {
              _this.$message({type: 'success', message: '添加成功'});
            } else {
              _this.$message({type: 'error', message: '请输入栏目名'});
            }
            _this.cateName = '';
            _this.refresh();
          }
          _this.loading = false;
        }, resp => {
          if (resp.response.status == 403) {
            _this.$message({
              type: 'error',
              message: resp.response.data
            });
          }
          _this.loading = false;
        });
      },
      deleteAll() {
        var _this = this;
        this.$confirm('确认删除这 ' + this.selItems.length + ' 条数据?', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          var selItems = _this.selItems;
          var ids = '';
          for (var i = 0; i < selItems.length; i++) {
            ids += selItems[i].id + ",";
          }
          _this.deleteCate(ids.substring(0, ids.length - 1));
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },
      handleEdit(index, row) {
        var _this = this;
        this.$prompt('请输入新名称', '编辑', {
          confirmButtonText: '更新',
          inputValue: row.cateName,
          cancelButtonText: '取消'
        }).then(({value}) => {
          //value就是输入值
          if (value == null || value.length == 0) {
            _this.$message({
              type: 'info',
              message: '数据不能为空!'
            });
          } else {
            _this.loading = true;
            putRequest("/api/category/", {id: row.id, cateName: value}).then(resp => {
              var json = resp.data;
              if (json.code == 2000) {
                _this.$message({type: 'success', message: '修改成功'});
              } else {
                _this.$message({type: 'error', message: '修改失败'});
              }
              _this.refresh();
            }, resp => {
              if (resp.response.status == 403) {
                _this.$message({
                  type: 'error',
                  message: resp.response.data
                });
              }
              _this.loading = false;
            });
          }
        });
      },
      handleDelete(index, row) {
        let _this = this;
        this.$confirm('确认删除 ' + row.cateName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(row.id);
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      deleteCate(ids) {
        var _this = this;
        this.loading = true;
        //删除
        deleteRequest("/api/category/" + ids).then(resp => {
          var json = resp.data;
          if (json.code == 2000) {
            _this.$message({type: 'success', message: '删除成功'});
          } else {
            _this.$message({type: 'error', message: '删除失败'});
          }
          _this.refresh();
        }, resp => {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({
              type: 'error',
              message: resp.response.data
            });
          } else if (resp.response.status == 500) {
            _this.$message({
              type: 'error',
              message: '该栏目下尚有文章，删除失败!'
            });
          }
        })
      },
      refresh() {
        let _this = this;
        _this.getList();
        // getRequest("/api/category/all").then(resp => {
        //   _this.categories = resp.data.data.rows;
        //   _this.loading = false;
        // }, resp => {
        //   if (resp.response.status == 403) {
        //     _this.$message({
        //       type: 'error',
        //       message: resp.response.data
        //     });
        //   }
        //   _this.loading = false;
        // });
      }
    },
    mounted: function () {
      this.loading = true;
      this.getList();
      this.loading = false
      // this.refresh();
    }

  }
</script>
<style>
  .cate_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cate_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>
