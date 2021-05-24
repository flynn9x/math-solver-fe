import React, { Component, useState, useEffect } from "react";
import Result from "../api/Result";
import MathJax from "react-mathjax2";

import { Row, Col } from "antd";
import { Layout } from "antd";
import { Divider } from "antd";
import { Modal, Button } from "antd";
import { List, Card } from "antd";
import { Typography } from "antd";
import { Menu } from "antd";

import { Link } from "react-router-dom";

// import Rightsidemenu from "../subcomponents/menu"
import "../css/solve.css";

const { SubMenu } = Menu;

const { Title } = Typography;

const { parse } = require("equation-parser");

var emails = [];

function SimpleDialog(props) {
  const { onClose, selectedValue, open, onOpen, value } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value, type) => {
    console.log(value);
    console.log(type);
    if (type == "check") {
      onClose(null);
      onOpen(value);
    } else {
      onClose(value);
    }
  };
  var [testMathjax, setMathJax] = useState("x");

  return (
    // <>
    <Modal
      footer={null}
      title="Chúng tôi có thể giúp gì cho bạn ?"
      visible={open}
      onCancel={handleClose}
    >
      {value.map((email) => (
        <Button
          type="text"
          block
          onClick={() => handleListItemClick(email.variable, email.type)}
        >
          <MathJax.Context>
            <MathJax.Node>
              {"\\text{" + email.detail + "}" + email.variable}
            </MathJax.Node>
          </MathJax.Context>
        </Button>
      ))}
    </Modal>

    // {/* <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" style={{
    //   padding: "0px 20px 0px 20px"
    // }} open={open}>
    //   <DialogTitle id="simple-dialog-title"><div style={{
    //     color: "#147f8f"
    //   }}> Chúng tôi có thể giúp gì cho bạn ?</div>
    //   </DialogTitle>
    //   <button onClick={() => {
    //     console.log(value)
    //   }}
    //   >123</button>
    //   <List style={{
    //     padding: "0px 15px 15px 15px"
    //   }}>
    //     {value.map((email) => (

    //       <List.Item button onClick={() => {
    //         handleListItemClick(email.variable, email.type);
    //       }
    //       } key={email.variable}>
    //         <MathJax.Context>
    //           <MathJax.Node>{"\\text{" + email.detail + "}" + email.variable}</MathJax.Node>
    //         </MathJax.Context>
    //       </List.Item>
    //     ))}
    //   </List>
    // </Dialog> */}
  );
}

function duyetObject(obj) {
  if (obj.a == undefined || obj.b == undefined) {
    if (obj.type == "variable") {
      if (obj.name.length == 1) {
        return obj.name;
      } else return "";
    } else if (obj.type == "negative") {
      return duyetObject(obj.value);
    } else if (obj.type == "block") {
      return duyetObject(obj.child);
    } else if (obj.type == "function") {
      return duyetObject(obj.args[0]);
    } else if (obj.type == "parser-error") {
      var tex =
        obj.equation.slice(0, obj.start + 1) +
        obj.equation.slice(obj.end + 1, obj.equation.length);
      return duyetObject(parse(tex));
    } else return "";
  } else {
    return duyetObject(obj.a) + duyetObject(obj.b);
  }
}
const Error = Object.freeze({
  NotEqual: "notequal",
  Notvariable: "notvariable",
  MulEqual: "mulequal",
});
function parseErrorHandle(obj) {
  console.log(obj);
}
function checkSyntax(obj) {
  console.log(obj);
  if (obj.type == "parser-error") {
    parseErrorHandle(obj);
    return false;
  } else if (
    obj.type == "equals" ||
    obj.type == "less-than" ||
    obj.type == "greater-than" ||
    obj.type == "less-than-equals" ||
    obj.type == "greater-than-equals"
  ) {
    if (
      obj.a.type == "equals" ||
      obj.a.type == "less-than" ||
      obj.a.type == "greater-than" ||
      obj.a.type == "less-than-equals" ||
      obj.a.type == "greater-than-equals" ||
      obj.b.type == "equals" ||
      obj.b.type == "less-than" ||
      obj.b.type == "greater-than" ||
      obj.b.type == "less-than-equals" ||
      obj.b.type == "greater-than-equals"
    ) {
      return Error.MulEqual;
    } else {
      return duyetObject(obj);
    }
  } else {
    if (duyetObject(obj) == "") {
      return Error.Notvariable;
    } else {
      return Error.NotEqual;
    }
  }
}

const listExample = ["x^2-2x+3 = 0", "2x^2 -5x-10=0", "-7x^2+10x-20=0"];
const listPlot = ["x^2-2x+3 = 0", "2x^2 -5x-10=0", "-7x^2+10x-20=0"];
const listdathuc = {
  default: {
    name: "Ví dụ",
    list: [
      "x-3=1",
      "2x^2 -5x-10=0",
      "3x^4-5x^2-1=0",
      "3\\tan(x)=2",
      "2\\cos(x)^2-3\\cos(x)+1=0",
    ],
  },
  ptb1: {
    name: "Phương trình bậc 1",
    list: ["x-3=1", "2x+7=0"],
  },
  ptb2: {
    name: "Phương trình bậc 2",
    list: ["x^2-2x+3 = 0", "2x^2 -5x-10=0", "-7x^2+10x-20=0"],
  },
  ptb4: {
    name: "Phương trình bậc 4 trùng phương",
    list: ["x^4-2x^2+1=0", "3x^4-5x^2-1=0"],
  },
  ptbc: {
    name: "Phương trình bậc cao",
    list: ["x^5-4x^4-7x^3+14x^2-44x+120=0"],
  },
  ptb1_trigo: {
    name: "Phương trình bậc lượng giác 1",
    list: ["2\\sin(x)+1=0", "3\\tan(x)=2"],
  },
  ptb2_trigo: {
    name: "Phương trình lượng giác bậc 2",
    list: ["2\\cos(x)^2-3\\cos(x)+1=0", "3\\cot(x)^2=2"],
  },
  ptb4_trigo: {
    name: "Phương trình lượng giác bậc 4 trùng phương",
    list: ["\\sin(x)^4-2\\sin(x)^2+1=0", "3\\cos(x)^4-5cos(x)^2-1=0"],
  },
  hptb1: {
    name: "Hệ phương trình bậc 1",
    list: ["\\begin{cases}x+y=1 \\\\ 2x-3y=3 \\end{cases}"],
  },
  ptc: {
    name: "Phương trình căn",
    list: ["\\sqrt{x-1}=x", "\\sqrt{3x^2+1} = 3x"],
  },
};
const listfunc = [
  {
    key: "dathuc",
    title: "Đa thức",
    sub: [
      {
        key: "ptb1",
        title: "PT bậc 1",
      },
      {
        key: "ptb2",
        title: "PT bậc 2",
      },
      {
        key: "ptb4",
        title: "PT bậc 4 trùng phương",
      },
      {
        key: "ptbc",
        title: "PT bậc cao",
      },
    ],
  },
  {
    key: "trigo",
    title: "Lượng giác",
    sub: [
      {
        key: "ptb1_trigo",
        title: "PT bậc 1",
      },
      {
        key: "ptb2_trigo",
        title: "PT bậc 2",
      },
      {
        key: "ptb4_trigo",
        title: "PT bậc 4 trùng phương",
      },
    ],
  },
  {
    key: "hpt",
    title: "Hệ PT",
    sub: [
      {
        key: "hptb1",
        title: "Hệ PT bậc 1",
      },
    ],
  },
  {
    key: "ptc",
    title: "PT căn",
    sub: [
      {
        key: "ptc",
        title: "PT căn",
      },
    ],
  },
];

const virtualKeyboard = {
  customVirtualKeyboardLayers: {
    number: {
      styles: "",
      rows: [
        [
          {
            class: "keycap",
            latex: ">",
          },
          { class: "keycap", latex: "x" },
          { class: "separator w5" },
          { class: "keycap", label: "7", key: "7" },
          { class: "keycap", label: "8", key: "8" },
          { class: "keycap", label: "9", key: "9" },
          { class: "keycap", latex: "\\div" },
          { class: "separator w5" },
          {
            class: "keycap tex small",
            label: "<span><i>x</i>&thinsp;²</span>",
            insert: "$$#@^{2}$$",
          },
          {
            class: "keycap tex small",
            latex: "{#0}^{#0}",
            insert: "$${#0}^{#0}$$",
          },

          // <li class="keycap tex" data-alt-keys="sqrt" data-insert="$$\sqrt{#0}$$" data-latex="\sqrt{#0}" data-command="[&quot;insert&quot;,&quot;$$\\sqrt{#0}$$&quot;,{&quot;focus&quot;:true,&quot;feedback&quot;:true,&quot;mode&quot;:&quot;math&quot;,&quot;format&quot;:&quot;latex&quot;,&quot;resetStyle&quot;:true}]"><span class="ML__mathlive" style="margin-left:0.06em;"><span class="ML__strut" style="height:1.05em;"></span><span class="ML__strut--bottom" style="height:1.21em;vertical-align:-0.15em;"></span><span class="ML__base"><span class="sqrt"><span class="sqrt-sign" style="top:-0.19em;"><span class="style-wrap"><span class="delimsizing size1">√</span></span></span><span class="vlist"><span><span><span><span class="ML__cmr">⬚
          // <li class="small" data-insert="$$\sqrt{#0}$$" data-latex="\sqrt{#0}"></li>
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
        ],
        [
          { class: "keycap tex", latex: "<" },
          { class: "keycap tex", latex: "y" },
          { class: "separator w5" },
          { class: "keycap tex", label: "4", latex: "4" },
          { class: "keycap tex", label: "5", key: "5" },
          { class: "keycap tex", label: "6", key: "6" },
          {
            class: "keycap",
            latex: "\\times",
          },
          { class: "keycap tex", class: "separator w5" },
          {
            class: "keycap small",
            latex: "\\begin{cases}#0 \\\\ #0\\end{cases}",
          },
          {
            class: "keycap tex small",
            latex: "\\frac{#0}{#0}",
            insert: "$$\\frac{#0}{#0}$$",
          },
          { class: "keycap tex small", label: "{" },
        ],
        [
          { class: "keycap tex", latex: "\\ge" },
          { class: "keycap tex", label: "<i>z</i>" },
          { class: "separator w5" },
          { class: "keycap tex", label: "1", key: "1" },
          { class: "keycap tex", label: "2", key: "2" },
          { class: "keycap tex", label: "3", key: "3" },
          { class: "keycap", latex: "-" },
          { class: "separator w5" },
          { class: "keycap tex small", label: "[" },
          { class: "keycap tex small", label: "]" },
          { class: "keycap tex small", label: "}" },
        ],
        [
          { class: "keycap tex", latex: "\\le" },
          { class: "keycap tex", latex: "t" },

          { class: "separator w5" },
          { class: "keycap tex", label: "0", key: "0" },
          { class: "keycap tex", latex: "." },
          { class: "keycap tex", latex: "\\pi" },
          { class: "keycap tex", latex: "+" },
          { class: "separator w5" },
          {
            class: "action",
            label: "<svg><use xlink:href='#svg-arrow-left' /></svg>",
            command: ["performWithFeedback", "moveToPreviousChar"],
          },
          {
            class: "action",
            label: "<svg><use xlink:href='#svg-arrow-right' /></svg>",
            command: ["performWithFeedback", "moveToNextChar"],
          },
          {
            class: "action font-glyph bottom right",
            label: "&#x232b;",
            command: ["performWithFeedback", "deleteBackward"],
          },
        ],
      ],
    },
    function1: {
      styles: "",
      rows: [
        [
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sin{#0}",
            insert: "$$\\sin{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sin^{#0}{#0}",
            insert: "$$\\sin^{#0}{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\log{#0}",
            insert: "$$\\log{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt{#0}",
            insert: "$$\\sqrt{#0}$$",
          },
        ],
        [
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\cos{#0}",
            insert: "$$\\cos{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\cos^{#0}{#0}",
            insert: "$$\\cos^{#0}{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\ln{#0}",
            insert: "$$\\ln{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\mathrm{e}^{#0}",
            insert: "$$\\mathrm{e}^{#0}$$",
          },

          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt[#0]{#0}",
            insert: "$$\\sqrt[#0]{#0}$$",
          },
          { class: "keycap tex", latex: "b" },
          { class: "keycap tex", latex: "b" },
          { class: "keycap tex", latex: "b" },
        ],
        [
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\tan{#0}",
            insert: "$$\\tan{#0}$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\tan^{#0}{#0}",
            insert: "$$\\tan^{#0}{#0}$$",
          },

          {
            class: "keycap tex small",
            latex: "\\log_{#0}(#0)",
            insert: "$$\\log_{ cơ số }(biểu thức)$$",
          },
          {
            class: "keycap tex small",
            // data-alt-keys="sqrt",
            latex: "\\sqrt[#0]{#0}",
            insert: "$$\\sqrt[#0]{#0}$$",
          },
          { class: "keycap tex", label: "<i>c</i>" },
          { class: "keycap tex", label: "<i>z</i>" },
          { class: "keycap tex", label: "<i>c</i>" },
          { class: "keycap tex", label: "<i>z</i>" },
        ],
        [
          { class: "keycap tex", label: "<i>c</i>" },
          { class: "keycap tex", label: "<i>z</i>" },
          { class: "keycap tex", label: "<i>c</i>" },
          { class: "keycap tex", label: "<i>z</i>" },
          { class: "keycap tex", label: "<i>c</i>" },
          {
            class: "action",
            label: "<svg><use xlink:href='#svg-arrow-left' /></svg>",
            command: ["performWithFeedback", "moveToPreviousChar"],
          },
          {
            class: "action",
            label: "<svg><use xlink:href='#svg-arrow-right' /></svg>",
            command: ["performWithFeedback", "moveToNextChar"],
          },
          {
            class: "action font-glyph bottom right",
            label: "&#x232b;",
            command: ["performWithFeedback", "deleteBackward"],
          },
        ],
      ],
    },
  },
  customVirtualKeyboards: {
    number: {
      label: "123",
      tooltip: "number keyboard",
      layer: "number",
    },
    function1: {
      label: "f()",
      tooltip: "function keyboard",
      layer: "function1",
    },
  },
  virtualKeyboards: "number function1 functions",
};

export default class BoardUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: "default",
      openResult: false,
      selectedValue: emails[1],
      valueDialog: emails,
      input_latex: 0,
      open: false,
    };
    // console.log(props)
    // var emails = [];
    // var [input_latex, setinput_latex] = useState(0);
    // var [valueDialog, setvalueDialog] = useState(emails);
    // const [open, setOpen] = React.useState(false);
    // const [selectedValue, setSelectedValue] = React.useState();
    // const [openResult, setOpenResult] = React.useState(false);
    // const [selectedType, setSelectedType] = React.useState(data.selectedType);
  }
  componentDidMount() {
    // var test = ""
    // if (this.props.location.state){
    //   // console.log(this.props.location)
    //   if (this.props.location.state.selectedType){
    //     test = this.props.location.state.selectedType
    //   }
    // }
    if (this.props.location.state){
    if (this.props.location.state.selectedType != undefined) {
      this.setState({
        selectedType: this.props.location.state.selectedType,
      });
    }
  }
  }

  handleClick = (e) => {
    // console.log(e)
    this.setState({ selectedType: e.key, openResult: false });
  };

  handleClickOpen = (test) => {
    emails = [];

    //NOTE
    if (test != "" && parse(test).type == "parser-error") {
      var objError = parse(test);

      if (objError.equation.indexOf("begin") != -1) {
        console.log(objError.equation);
        objError.equation = objError.equation.replace(/begin/g, "");
        objError.equation = objError.equation.replace(/{cases}/g, "");
        objError.equation = objError.equation.replace(/end/g, "");

        console.log(objError.equation);
        console.log(objError.equation.indexOf("\\\\"));

        var sub1 = objError.equation.substr(
          0,
          objError.equation.indexOf("\\\\")
        );
        var sub2 = objError.equation.substr(
          objError.equation.indexOf("\\\\") + 1,
          objError.equation.length
        );
        sub1 = sub1.replace(/\\/g, "");
        sub2 = sub2.replace(/\\/g, "");
        if (
          checkSyntax(parse(sub1)) == checkSyntax(parse(sub2)) &&
          checkSyntax(parse(sub1)) != "notequal" &&
          checkSyntax(parse(sub1)) != "mulequal" &&
          checkSyntax(parse(sub1)) != "notvariable"
        ) {
          emails.push({ variable: "", detail: "Giải hệ phương trình" });
        } else {
          emails.push({
            variable: "",
            detail: "Bài toán bạn nhập sai hoặc chưa được hỗ trợ, xin cảm ơn",
          });
        }
      } else if (objError.equation.indexOf("sin") != -1) {
        console.log(objError.equation);
        objError.equation = objError.equation.replace(/\\mleft/g, "");
        objError.equation = objError.equation.replace(/\\mright/g, "");
        var hihi = objError.equation;
        objError.equation = objError.equation.replace(/\\sin/g, "");
        objError.equation = objError.equation.replace(/\\cos/g, "");
        objError.equation = objError.equation.replace(/\^/g, "");
        if (
          checkSyntax(parse(objError.equation)).length != 1 &&
          checkSyntax(parse(objError.equation)) != "notequal" &&
          checkSyntax(parse(objError.equation)) != "mulequal" &&
          checkSyntax(parse(objError.equation)) != "notvariable"
        ) {
          emails.push({
            variable: hihi,
            detail: "Giải phương trình lượng giác",
          });
        } else {
          emails.push({
            variable: "",
            detail: "Bài toán bạn nhập sai hoặc chưa được hỗ trợ, xin cảm ơn",
          });
        }
      }
    } else if (test != "" && checkSyntax(parse(test)) != false) {
      var test1 = checkSyntax(parse(test));
      console.log(test1);
      if (test1 == "notequal") {
        var test3 = duyetObject(parse(test)).split("");
        const uniqueSet1 = new Set(test3);
        const backToArray1 = [...uniqueSet1];
        console.log(backToArray1);
        if (backToArray1.length == 1) {
          emails.push({
            variable: test,
            detail: "Khảo sát và vẽ đồ thị hàm số ",
          });
          emails.push({
            variable: test + "=0",
            detail: "Giải phương trình ",
            type: "check",
          });
          emails.push({
            variable: test + ">0",
            detail: "Giải bất phương trình ",
          });
          emails.push({
            variable: test + "<0",
            detail: "Giải bất phương trình ",
          });
        } else {
          emails.push({
            variable: test,
            detail: "Khảo sát và vẽ đồ thị hàm số ",
          });
          emails.push({
            variable: test + "=0",
            detail: "Giải phương trình ",
            type: "check",
          });
        }
      } else if (test1 == "mulequal") {
        emails.push({
          variable: "",
          detail: "Bài toán bạn nhập sai hoặc chưa được hỗ trợ, xin cảm ơn",
        });
      } else if (test1 == "notvariable") {
        emails.push({ variable: test, detail: "Tính kết quả phép tính" });
      } else {
        var test2 = test1.split("");
        const uniqueSet = new Set(test2);
        const backToArray = [...uniqueSet];
        console.log(backToArray);
        backToArray.forEach(function (item, index, array) {
          emails.push({
            variable: item,
            detail: "Giải phương trình theo biến ",
          });
        });
        console.log(emails);
      }
    } else {
      emails.push({
        variable: "",
        detail: "Bài toán bạn nhập sai hoặc chưa được hỗ trợ, xin cảm ơn",
      });
    }
    this.setState({ valueDialog: emails });
    this.setState({ open: true });
  };

  clickExer = (item) => {
    document.getElementById("formula1").value = item;
    this.setState({ input_latex: item });
    this.setState({ selectedValue: "x" });
    this.setState({ openResult: true });
  };

  handleClose = (value) => {
    if (value == null) {
      // console.log("test");
      this.setState({ open: false });
    } else {
      this.setState({ open: false });
      this.setState({ selectedValue: value });
      this.setState({
        input_latex: document.getElementById("formula1").getValue("latex"),
      });
      this.setState({ openResult: true });
    }
  };

  render() {
    return (
      <>
        <Row style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <Col span={21}>
            <math-field
              id="formula1"
              virtual-keyboard-mode="onfocus"
              smart-mode={true}
              smart-fence={true}
              virtual-keyboard-theme="apple"
              smart-superscript={true}
              use-shared-virtual-keyboard={true}
              style={{
                width: "100%",
                backgroundColor: "#ffffff",
                height: "90px",
                borderRadius: "10px",
                color: "#000000",
                fontSize: "20px",
              }}
            ></math-field>
          </Col>
          <Col span={3}>
            <Col span={22} offset={1}>
              <Button
                type="primary"
                block
                style={{ height: "40px" }}
                onClick={() => {
                  var testASC = document
                    .getElementById("formula1")
                    .getValue("ASCIIMath");
                  var inputLatex = document
                    .getElementById("formula1")
                    .getValue("latex");

                  if (inputLatex != "") {
                    console.log(inputLatex);
                    this.handleClickOpen(this.state.inputLatex);
                  } else if (testASC != "") {
                    console.log(testASC);
                    this.handleClickOpen(testASC);
                  }
                }}
              >
                Submit
              </Button>
              <SimpleDialog
                value={this.state.valueDialog}
                onOpen={this.handleClickOpen}
                selectedValue={this.state.selectedValue}
                selectedValue={this.state.selectedValue}
                open={this.state.open}
                onClose={this.handleClose}
              />
            </Col>
          </Col>
        </Row>
        <Row style={{ minHeight: "100%", minHeight: "80vh" }}>
          {!this.state.openResult && (
            <>
              <Row style={{ minWidth: "100%" }}>
                <Col span={4}>
                  <Menu
                    onClick={this.handleClick}
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                  >
                    {listfunc.map((item) => {
                      return (
                        <SubMenu key={item.key} title={item.title}>
                          {item.sub.map((subitem) => {
                            return (
                              <Menu.Item key={subitem.key}>
                                {subitem.title}
                              </Menu.Item>
                            );
                          })}
                        </SubMenu>
                      );
                    })}
                  </Menu>
                </Col>
                <Col span={14}>
                  <Card style={{ minWidth: "100%", minHeight: "100%" }}>
                    <Col span={24}>
                      <Divider orientation="left" plain>
                        <Title level={3}>
                          {listdathuc[this.state.selectedType].name}
                        </Title>
                      </Divider>
                      <Row gutter={8}>
                        {listdathuc[this.state.selectedType].list.map(
                          (item) => {
                            return (
                              <Col span={12} className="solve_item">
                                <Button
                                  block
                                  className="solve_dathuc"
                                  onClick={() => this.clickExer(item)}
                                >
                                  <MathJax.Context>
                                    <MathJax.Node>{item}</MathJax.Node>
                                  </MathJax.Context>
                                </Button>
                              </Col>
                            );
                          }
                        )}
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Divider orientation="left" plain>
                        <Title level={3}>Vẽ đồ thị</Title>
                      </Divider>
                      <Row gutter={8}>
                        {listPlot.map((item) => {
                          return (
                            <Col span={8}>
                              <Button className="solve_plot" block>
                                <MathJax.Context>
                                  <MathJax.Node>{item}</MathJax.Node>
                                </MathJax.Context>
                              </Button>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Card>
                </Col>
                <Col span={6}>
                  <Row>
                    <Col span={24}>
                      <Card title="Vẽ đồ thị">
                        <MathJax.Context>
                          <MathJax.Node>{this.state.input_latex}</MathJax.Node>
                        </MathJax.Context>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card title="Bài tập">
                        <List>
                          <Row>
                            {listExample.map((item) => {
                              return (
                                <Col span={24} className="solve_item">
                                  <Link
                                    to={{
                                      pathname: "/exercise",
                                      state: { state: item },
                                    }}
                                  >
                                    <Button className="solve_dathuc" block>
                                      <MathJax.Context>
                                        <MathJax.Node>{item}</MathJax.Node>
                                      </MathJax.Context>
                                    </Button>
                                  </Link>
                                </Col>
                              );
                            })}
                          </Row>
                        </List>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          )}
          {this.state.openResult && (
            <>
              <Col span={4}>
                <Menu
                  onClick={this.handleClick}
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["sub1"]}
                  mode="inline"
                >
                  {listfunc.map((item) => {
                    return (
                      <SubMenu key={item.key} title={item.title}>
                        {item.sub.map((subitem) => {
                          return (
                            <Menu.Item key={subitem.key}>
                              {subitem.title}
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  })}
                </Menu>
              </Col>
              <Col span={14}>
                <Card>
                  <Result
                    tex={this.state.input_latex}
                    var={this.state.selectedValue}
                  ></Result>
                </Card>
              </Col>
              <Col span={6}>
                <Row>
                  <Col span={24}>
                    <Card title="Vẽ đồ thị">
                      <MathJax.Context>
                        <MathJax.Node>{this.state.input_latex}</MathJax.Node>
                      </MathJax.Context>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Bài tập">
                      <List>
                        <Row>
                          {listExample.map((item) => {
                            return (
                              <Col span={24} className="solve_item">
                                <Link
                                  to={{
                                    pathname: "/exercise",
                                    state: { state: item },
                                  }}
                                >
                                  <Button className="solve_dathuc" block>
                                    <MathJax.Context>
                                      <MathJax.Node>{item}</MathJax.Node>
                                    </MathJax.Context>
                                  </Button>
                                </Link>
                              </Col>
                            );
                          })}
                        </Row>
                      </List>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </>
          )}
        </Row>
      </>
    );
  }
}
