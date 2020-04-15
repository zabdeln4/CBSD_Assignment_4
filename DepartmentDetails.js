import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("database");

export default class DepartmentDetail extends Component {
  state = {
    departmentID: this.props.route.params.departmentID,
    department: null,
  };

  getDepartmentData = (departmentID) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from department where name = ?",
        [departmentID],
        (_, { rows }) => {
          if (rows.length > 0) this.setState({ department: rows._array });
          else this.setState({ department: null });
        }
      );
    });
  };

  render() {
    const { departmentID } = this.props.route.params;

    this.getDepartmentData(departmentID);

    return (
      <View style={styles.empcontainer}>
        {this.state.department !== null ? (
          <View>
            <Text style={styles.text1}>
              Name: {this.state.department[0].name}
            </Text>
          </View>
        ) : (
          <Text></Text>
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
});
