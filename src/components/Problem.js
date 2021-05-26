import React, { Component } from "react";
import Popup from "../api/Popup";
import { List, Card } from "antd";
import { Button } from "antd";
import { Row, Col } from "antd";
import { Checkbox, Divider } from "antd";
import { Select } from "antd";
import { Layout } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import "antd/dist/antd.css";

const { SubMenu } = Menu;

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;

class ContentProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      listProblem: [],
      idProblem: "",
      nameProblem: "",
      listSubject: [],
      selectedSubject: [],
      checkedAll: true,
      checked: [],
      grade: [],
      selectedGrade: "",
      isLoad: false,
      checkedList: [],
      indeterminate: true,
      checkAll: true,
    };
    fetch("http://api.bkmathapp.tk/api/list_problem", {
      method: "POST",
    }).then((res) => {
      res.json().then((db) => {
        var listSubject = [];
        var listGrade = [];
        db.result.forEach((element) => {
          if (!listSubject.includes(element.subject)) {
            listSubject.push(element.subject);
          }
          if (!listGrade.includes(element.grade)) {
            listGrade.push(element.grade);
          }
        });
        this.setState({
          listProblem: db.result,
          listSubject: listSubject,
          checkedList: listSubject,
          grade: listGrade,
          isLoad: true,
        });
        console.log(this.state.isLoad);
      });
    });
  }

  handleClose = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
    document.getElementById("listProblem").style.display = null;
  };

  handleClick = (event, id, nameProblem) => {
    this.setState({
      isOpen: !this.state.isOpen,
      idProblem: id,
      nameProblem: nameProblem,
    });
    console.log(nameProblem);
    this.setState({ nameProblem: nameProblem });
    console.log(this.state.nameProblem);
    document.getElementById("listProblem").style.display = "none";
  };

  onChange = (list) => {
    this.setState({
      checkedList: list,
      indeterminate:
        !!list.length && list.length < this.state.listSubject.length,
      checkAll: list.length === this.state.listSubject.length,
    });
  };

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.state.listSubject : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    return (
      <Card>
        <Row style={{ display: "block" }}>
          <Card loading={!this.state.isLoad}>
            <Row className="listProblem" id="listProblem">
              <Col span={24} style={{ padding: "0px 12px" }}>
                <Row gutter={16}>
                  <Col span={18} style={{ paddingBottom: "8px" }}>
                    <Col span={24}>
                      <Divider>Subject</Divider>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={(list) => this.onCheckAllChange(list)}
                        checked={this.state.checkAll}
                      >
                        All
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox.Group
                        style={{ padding: "4px 0" }}
                        value={this.state.checkedList}
                        onChange={(e) => this.onChange(e)}
                      >
                        <Row>
                          {this.state.listSubject.map((value) => {
                            return (
                              <Col span={6} style={{ padding: "4px 0" }}>
                                <Checkbox value={value}>{value}</Checkbox>
                              </Col>
                            );
                          })}
                        </Row>
                      </Checkbox.Group>
                    </Col>
                  </Col>

                  <Col span={6}>
                    <Divider>Grade</Divider>
                    <Row justify="center">
                      <Select
                        defaultValue={this.state.selectedGrade}
                        style={{ width: 120 }}
                        onChange={(event) => {
                          this.setState({ selectedGrade: event });
                        }}
                      >
                        <Option value="">All</Option>
                        {this.state.grade.map((value) => {
                          return (
                            <Option value={value}>{"Grade " + value}</Option>
                          );
                        })}
                      </Select>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <div>
                  <List>
                    {this.state.listProblem.map((element, i) => {
                      var selectedSubject = this.state.checkedList;
                      if (this.state.checkAll) {
                        selectedSubject = this.state.listSubject;
                      }
                      if (
                        selectedSubject.includes(element.subject) &&
                        (this.state.selectedGrade == "" ||
                          this.state.selectedGrade == element.grade)
                      ) {
                        return (
                          <List.Item style={{ display: "block" }}>
                            <Card
                              title={element.name}
                              extra={
                                <Button
                                  type="primary"
                                  onClick={(e) =>
                                    this.handleClick(
                                      e,
                                      element.id,
                                      element.name
                                    )
                                  }
                                >
                                  Chọn
                                </Button>
                              }
                            >
                              {element.description}
                            </Card>
                          </List.Item>
                        );
                      }
                    })}
                  </List>
                </div>
              </Col>
            </Row>
          </Card>
          <div className="popup">
            {this.state.isOpen && (
              <Popup
                idProblem={this.state.idProblem}
                nameProblem={this.state.nameProblem}
                handleClose={this.handleClose}
              />
            )}
          </div>
        </Row>
      </Card>
    );
  }
}

export default function Problem() {
  const [selectedType, setSelectedType] = React.useState("default");
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

  const handleClick = (e) => {
    setSelectedType(e.key);
  };

  return (
    <Row
      gutter={12}
      style={{ marginTop: "24px", minWidth: "100%", minHeight: "80vh" }}
    >
      <Col span={6}>
        <Menu
          onClick={handleClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          className="menu"
        >
          {listfunc.map((item) => {
            return (
              <SubMenu key={item.key} title={item.title}>
                {item.sub.map((subitem) => {
                  return (
                    <Menu.Item key={subitem.key}>
                      <Link
                        to={{
                          pathname: "/polynomial",
                          state: { selectedType: subitem.key },
                        }}
                      >
                        {subitem.title}
                      </Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </Col>
      <Col span={18}>
        <ContentProblem></ContentProblem>
      </Col>
    </Row>
  );
}