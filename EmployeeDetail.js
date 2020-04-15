import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("database");

export default class EmployeeDetail extends Component {
  state = {
    employeeID: this.props.route.params.employeeID,
    employee: null,
    department: null /*this.props.route.params.departmentID*/,
  };

  getEmployeesData = (employeeID) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from employee where EmpID = ?",
        [employeeID],
        (_, { rows }) => {
          if (rows.length > 0) this.setState({ employee: rows._array });
          else this.setState({ employee: null });
        }
      );
    });
  };

  getDepartmentName = (Dept_id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select name from department where DepID = ?",
        [Dept_id],
        (_, { rows }) => {
          if (rows.length > 0) this.setState({ department: rows._array });
          else this.setState({ department: null });
        }
      );
    });
  };

  render() {
    const { employeeID } = this.props.route.params;

    this.getEmployeesData(employeeID);
    this.state.employee !== null
      ? this.getDepartmentName(this.state.employee[0].Dept_id)
      : "";

    return (
      <View style={styles.empcontainer}>
        {this.state.employee !== null ? (
          <View>
            <Text style={styles.text1}>
              Name: {this.state.employee[0].fname}{" "}
              {this.state.employee[0].lname}
            </Text>
            <Text style={styles.text1}>
              Title: {this.state.employee[0].title}
            </Text>
            <Text style={styles.text1}>
              Phone: {this.state.employee[0].phone}
            </Text>
            <Text style={styles.text1}>
              Email: {this.state.employee[0].email}
            </Text>
          </View>
        ) : (
          <Text></Text>
        )}

        {this.state.department !== null ? (
          this.state.department.map((department, key) => (
            <View key={key} style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.department}
                onPress={() => {
                  this.props.navigation.navigate("DepartDetails", {
                    departmentID: department.name,
                  });
                }}
              >
                <Text style={styles.text1}>Department: {department.name}</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.sectionContainer}>
            <Text style={{ textAlign: "center" }}>Nothing To Show</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  empcontainer: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    textAlign: "left",
  },
  text1: {
    textAlign: "left",
    fontSize: 22,
    color: "black",
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  department: {
    backgroundColor: "#46aaeb",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 40,
    paddingLeft: 40,
  },
});
