<template>
  <div>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="OpenElement()">
      新增元素
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="OpenAttribute()">
      管理属性
    </el-button>
    <el-table :data="elementList">
      <el-table-column label="元素名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="元素属性">
        <template slot-scope="{row}">
          <div v-for="(value,index) in row.attribute_list">
            <a>{{ value.info }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                     @click="DeleteTheElement(row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="属性管理" :visible.sync="dialogAttribute">
      <el-form ref="form" :model="TempAttribute" label-width="80px">
        <el-form-item>
          <a>请输入需求描述</a>
          <div>
            <el-input v-model="TempAttribute.name"></el-input>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check"
                       @click="addNewAttribute(TempAttribute.name)"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-table :data="AttributeList">
        <el-table-column label="id">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性信息">
          <template slot-scope="{row}">
            <span>{{ row.info }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                       @click="delTheAttribute(row.info)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="新增元素" :visible.sync="dialogElement">
      <el-form ref="form" :model="TempElement" label-width="80px">
        <el-form-item>
          <a>新增元素名称</a>
          <div>
            <el-input v-model="TempElement.name"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <el-table :data="AttributeList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="id">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性信息">
          <template slot-scope="{row}">
            <span>{{ row.info }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="CreateTheElement()">
        保存元素
      </el-button>
    </el-dialog>


  </div>

</template>

<script>
import {addAttribute, delAttribute, getAttributes, crateElement, getAllElements, delElement} from "@/api/to_yaml"

export default {
  name: "to_yaml_admin",
  created() {
    this.getAttributesList()
    this.getTheAllElements()
  }
  ,
  data() {
    return {
      dialogAttribute: false,
      dialogElement: false,
      TempAttribute: {
        name: undefined
      },
      TempElement: {
        name: undefined
      },
      AttributeList: [],
      elementList: [],
      multipleSelection: []
    }
  }
  ,
  methods: {
    OpenElement() {
      this.dialogElement = true
    }
    ,
    OpenAttribute() {
      this.dialogAttribute = true
    }
    ,
    getAttributesList() {
      getAttributes().then(response => {
        console.log(response)
        this.AttributeList = response.data
      })
    },
    getTheAllElements() {
      getAllElements().then(response => {
        console.log(response)
        this.elementList = response.data
      })
    },
    addNewAttribute(data) {
      console.log(data)
      addAttribute({info: data}).then(response => {
        console.log(response)
      })
      this.getAttributesList()
    },
    delTheAttribute(info) {
      console.log(info)
      delAttribute(info).then(response => {
        console.log(response)
      })
      this.getAttributesList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    CreateTheElement() {
      const postData = {
        name: this.TempElement.name,
        attribute_list: this.multipleSelection
      }

      crateElement(postData).then(response => {
        console.log(response)
      })
      this.TempElement = {
        name: undefined
      }
      this.getTheAllElements()
      this.dialogElement = false
    },
    DeleteTheElement(data) {
      delElement(data).then(response => {
        console.log(response)
      })
      this.getTheAllElements()
    }
  }
}
</script>

<style scoped>

</style>
