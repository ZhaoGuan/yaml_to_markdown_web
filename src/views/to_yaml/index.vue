<template>

  <div class="app-container">
    <div>
      <el-upload
        action=""
        class="upload-demo"
        ref="upload"
        :on-change="uploadChange"
        :auto-upload="false"
        :limit="1">
        <el-button style="margin-left: 10px;" type="primary">选择需要解析的YAML文件</el-button>
      </el-upload>
    </div>
    <el-form :model="DataForm" :rules="rules">
      <el-form-item prop="Desc">
        <div>用例描述</div>
        <el-input
          v-model="DataForm.Desc"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>

      <el-input v-model="tempPreCondition" placeholder="预制条件" style="width: 200px;" class="filter-item"
                @keyup.enter.native=""/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check"
                 @click="addPreCondition()"/>
      <el-table :data="DataForm.PreCondition">
        <el-table-column label="预制条件">
          <template slot-scope="{row}">
            <span>{{ row }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                       @click="delPreCondition(row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="CreateTestPlant">
          新增测试计划内容
        </el-button>
        <el-table :data="DataForm.TestPlant">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <el-table label-position="left" :data="row.CheckPoint.cases">
                <el-table-column label="用例内容">
                  <template slot-scope="{row}">
                    <span>{{ row.case.action }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="预期">
                  <template slot-scope="{row}">
                    <span>{{ row.case.assert }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="等级">
            <template slot-scope="{row}">
              <span>{{ row.CheckPoint.level }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="{row}">
              <span>{{ row.CheckPoint.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="元素名称">
            <template slot-scope="{row}">
              <span>{{ row.CheckPoint.element }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                         @click="delTestPlant(row)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="CreateLog">
          新增变更日志
        </el-button>
        <el-table :data="DataForm.ChangeLog">
          <el-table-column label="版本号">
            <template slot-scope="{row}">
              <span>{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变更信息">
            <template slot-scope="{row}">
              <span>{{ row.message }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                         @click="delChangeLog(row)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="CreateStory">
          需求记录
        </el-button>
        <el-table :data="DataForm.Story">
          <el-table-column label="需求描述">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求连接">
            <template slot-scope="{row}">
            <span>
              <a>{{ row.link }}</a>
            </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-delete"
                         @click="delStory(row)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-form-item prop="FileName">
          <el-aside>用例文件名称:</el-aside>
          <el-input v-model="DataForm.FileName" style="width: 200px;" class="filter-item"></el-input>
          <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-check"
                     @click="createYaml()">生成YAML用例文件
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--dialog-->
    <el-dialog title="Test Plant" :visible.sync="dialogTestPlant">
      <el-form ref="form" :model="TempTestPlant" :rules="TestPlantRules" label-width="80px">
        <el-form-item label="等级">
          <el-select v-model="TempTestPlant.level" placeholder="请选择元素名称">
            <el-option v-for="(value) in levelList" :label="value" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例描述" prop="desc">
          <el-input v-model="TempTestPlant.desc"></el-input>
        </el-form-item>
        <el-form-item label="元素名称" prop="element">
          <el-select v-model="TempTestPlant.element" placeholder="请选择元素名称"
                     @change="updateAttrList">
            <el-option v-for="(value) in elementList" :label="value.name" :value="value.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性">
          <div v-for="(input) in cases">
            <div>{{ input.case.action }}</div>
            <el-input v-model="input.case.assert"></el-input>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check"
                   @click="saveTempTestPlant()">
          保存内容
        </el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="Change Log" :visible.sync="dialogLog">
      <el-form ref="form" :model="TempChangeLog" :rules="ChangeLogRules" label-width="80px">
        <el-form-item prop="version">
          <a>请输入版本号</a>
          <el-input v-model="TempChangeLog.version"></el-input>
        </el-form-item>
        <el-form-item prop="message">
          <a>请输入版本变更记录内容</a>
          <el-input v-model="TempChangeLog.message"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check"
                 @click="saveTempChangeLog()">
        保存内容
      </el-button>
    </el-dialog>
    <el-dialog title="Story" :visible.sync="dialogStory">
      <el-form ref="form" :model="TempStory" :rules="StoryRules" label-width="80px">
        <el-form-item prop="name">
          <a>请输入需求描述</a>
          <el-input v-model="TempStory.name"></el-input>
        </el-form-item>
        <el-form-item prop="link">
          <a>请输入需求链接</a>
          <el-input v-model="TempStory.link"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-check"
                 @click="saveStory()">
        保存内容
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import {getAllElements} from "@/api/to_yaml"

export default {
  created() {
    getAllElements().then(response => {
      const theData = response.data
      for (const index in theData) {
        if (theData.hasOwnProperty(index)) {
          this.elementList.push({name: theData[index].name, value: theData[index].name})
          this.attrListSelect[theData[index].name] = []
          for (const index_ in theData[index].attribute_list) {
            if (theData[index].attribute_list.hasOwnProperty(index_)) {
              this.attrListSelect[theData[index].name].push({
                case: {
                  action: theData[index].attribute_list[index_]["info"],
                  assert: ""
                }
              })
            }

          }

        }
      }
    })
  },
  data() {
    return {
      // dialog 控制
      dialogTestPlant: false,
      dialogLog: false,
      dialogStory: false,
      DataForm: {
        FileName: undefined,
        //用例描述
        Desc: undefined,
        // 预置条件
        PreCondition: [],
        // 用例步骤列表
        TestPlant: [],

        // 变更日志
        ChangeLog: [],
        // 需求
        Story: [],

        // 相关模块
        RelatedModule: [],
      },
      tempPreCondition: undefined,
      TempTestPlant: {
        level: "P0",
        desc: undefined,
        element: undefined,
        cases: []
      },
      TempChangeLog: {
        version: undefined,
        message: undefined
      },
      temp: {
        desc: undefined,
        level: "P0",
        case: undefined,
        action: undefined
      },
      TempStory: {
        name: undefined,
        link: undefined
      },
      levelList: ["P0", "P1", "P2", "P3"],
      elementList: [],
      cases: [],
      attrListSelect: {},
      rules: {
        Desc: [{required: true, message: '请输入用例描述', trigger: 'blur'}],
        FileName: [{required: true, message: '请输入用例文件名称', trigger: 'blur'}]
      },
      TestPlantRules: {
        desc: [{required: true, message: '请输入用例描述', trigger: 'blur'}],
        element: [{required: true, message: '请选择元素', trigger: 'change'}]
      },
      ChangeLogRules: {
        version: [{required: true, message: '请填写版本号', trigger: 'blur'}],
        message: [{required: true, message: '请输入对应修改信息', trigger: 'blur'}]
      },
      StoryRules: {
        name: [{required: true, message: '请出入需求名称', trigger: 'blur'}],
        link: [{required: true, message: '请填写需求链接', trigger: 'blur'}]
      }

    }
  },
  methods: {
    // dialog调起
    CreateTestPlant() {
      this.dialogTestPlant = true
    },
    CreateLog() {
      this.dialogLog = true
    },
    CreateStory() {
      this.dialogStory = true
    },
    // 预置条件操作
    addPreCondition() {
      if (this.tempPreCondition != null) {
        this.DataForm.PreCondition.push(this.tempPreCondition);
      }
      this.tempPreCondition = undefined;
    },
    delPreCondition(data) {
      const listData = this.DataForm.PreCondition;
      const pos = listData.indexOf(data);
      listData.splice(pos, 1);
    },
    updateAttrList(item) {
      this.cases = this.attrListSelect[item]
    },
    // 测试步骤操作
    saveTempTestPlant() {
      for (const caseIndex in this.cases) {
        if (this.cases.hasOwnProperty(caseIndex)) {
          if (this.cases[caseIndex].case.assert === "") {
            alert(this.cases[caseIndex].case.action + "没有填写具体内容")
            return;
          }
        }
      }
      this.TempTestPlant.cases = this.cases;
      this.cases = [];
      this.DataForm.TestPlant.push({CheckPoint: this.TempTestPlant});
      this.TempTestPlant = {
        level: "P0",
        desc: undefined,
        element: undefined,
        cases: []
      };
      // 关闭dialog
      this.dialogTestPlant = false;
    },
    delTestPlant(data) {
      const listData = this.DataForm.TestPlant;
      const pos = listData.indexOf(data);
      listData.splice(pos, 1);
    },
    // 变成日志操作
    saveTempChangeLog() {
      if (this.TempChangeLog.version === undefined || this.TempChangeLog.message === undefined) {
        alert("请完成填写内容！")
        return;
      }
      this.DataForm.ChangeLog.push(this.TempChangeLog);
      this.TempChangeLog = {
        version: undefined,
        message: undefined
      };
      this.dialogLog = false;
    },
    delChangeLog(data) {
      const listData = this.DataForm.ChangeLog;
      const pos = listData.indexOf(data);
      listData.splice(pos, 1);
    },
    // 变更需求操作
    saveStory() {
      if (this.TempStory.name === undefined || this.TempStory.link === undefined) {
        alert("请完成填写内容！")
        return;
      }
      this.DataForm.Story.push(this.TempStory)
      this.TempStory = {
        name: undefined,
        link: undefined
      }
      this.dialogStory = false
    },
    delStory(data) {
      const listData = this.DataForm.Story;
      const pos = listData.indexOf(data);
      listData.splice(pos, 1);
    },
    // upload
    uploadChange(file) {
      const YAML = require("js-yaml")
      let reader = new FileReader();   //先new 一个读文件的对象 FileReader
      if (typeof FileReader === "undefined") {  //用来判断你的浏览器是否支持 FileReader
        this.$message({
          type: "info",
          message: "您的浏览器不支持文件读取。"
        });
        return;
      }
      //  reader.readAsText(file.raw, "gb2312");  //读.txt文件
      reader.readAsArrayBuffer(file.raw); //读任意文件
      function YamlParse(e) {
        let ints = new Uint8Array(e.target.result); //要使用读取的内容，所以将读取内容转化成Uint8Array
        ints = ints.slice(0, 5000); //截取一段读取的内容
        let snippets = new TextDecoder('utf-8').decode(ints); //二进制缓存区内容转化成中文（即也就是读取到的内容）
        const YamlData = YAML.load(snippets)
        this.DataForm.Desc = YamlData.Desc;
        this.DataForm.Story = YamlData.Story;
        this.DataForm.ChangeLog = YamlData.ChangeLog;
        this.DataForm.TestPlant = YamlData.TestPlan;
        this.DataForm.PreCondition = YamlData.PreCondition;
      }

      reader.onload = YamlParse.bind(this)
    },
    // 生成YAML文件
    createYaml() {
      if (this.DataForm.Desc === undefined ||
        this.DataForm.FileName === undefined) {
        alert("用例描述或者用例文件名称未填写!")
        return;
      }
      const result = this.DataForm
      const YAML = require("js-yaml")
      const YamlResult = YAML.dump(result)
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([YamlResult])
      //生成url对象
      let urlObject = window.URL || window.webkitURL || window
      let url = urlObject.createObjectURL(content)
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download = this.DataForm.FileName + ".yml"
      //必须点击否则不会下载
      el.click()
      //移除链接释放资源
      urlObject.revokeObjectURL(url)
    }
  }
}
</script>

