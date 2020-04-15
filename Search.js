import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("database");

export default class Search extends React.Component {
  state = {
    text: null,
    employees: null,
  };

  componentDidMount() {
    console.log("DidMount");
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists employee (EmpID integer primary key not null, fname text not null, lname text not null, title text not null, phone text not null, email text not null, Dept_id integer, FOREIGN KEY(Dept_id) REFERENCES Department(DeptID));"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists department (DepID integer primary key not null, name text not null);"
      );
    });

    this.onCreate();
  }

  // insert values
  onCreate = () => {
    db.transaction((tx) => {
      tx.executeSql("insert into department (name) values (?)", [
        "Data Science",
      ]);
      tx.executeSql("insert into department (name) values (?)", ["IT"]);
    });

    db.transaction((tx) => {
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        [
          "Ziad",
          "Abdelnabi",
          "Data Scientest",
          "542-9861-637",
          "ziad@uoregon.com",
          1,
        ]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        ["Sam", "Issac", "Data Scientest", "542-9631-266", "sam@uoregon.com", 1]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        [
          "Sam",
          "Andrson",
          "Data Scientest",
          "326-6589-123",
          "S_Andrson@uoregon.com",
          1,
        ]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        [
          "Andro",
          "J.K",
          "Data Scientest",
          "325-4899-568",
          "andro@uoregon.com",
          1,
        ]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        ["Chin", "Ilsong", "IT", "235-1235-458", "chim@uoregon.com", 2]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        ["Nora", "Adbzed", "IT", "658-9875-123", "nora@uoregon.com", 2]
      );
      tx.executeSql(
        "insert into employee (fname, lname, title, phone, email, Dept_id) values (?,?,?,?,?,?)",
        [
          "Mossad",
          " Ahmed",
          "IT Manager",
          "987-5641-333",
          "mossad@uoregon.com",
          2,
        ]
      );
    });
  };

  componentWillUnmount() {
    this.onUpgrade();
  }

  onUpgrade = () => {
    console.log("DidMount");

    db.transaction((tx) => {
      tx.executeSql("drop table department", []);
      tx.executeSql("drop table employee", []);
    });
  };

  getEmployees = (query) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select EmpID, fname, lname from employee where fname = ?",
        [query],
        (_, { rows }) => {
          if (rows.length > 0) this.setState({ employees: rows._array });
          else this.setState({ employees: null });
        }
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Enter Employee Name</Text>
        <View style={styles.flexRow}>
          <TextInput
            onChangeText={(text) => this.setState({ text })}
            onSubmitEditing={() => {
              this.getEmployees(this.state.text);
              this.setState({ text: null });
            }}
            placeholder="Search Query"
            style={styles.input}
            value={this.state.text}
          />
        </View>
        <ScrollView style={styles.listArea}>
          {this.state.employees !== null ? (
            this.state.employees.map((employee, key) => (
              <View key={key} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.employee}
                  onPress={() => {
                    this.props.navigation.navigate("Detail", {
                      employeeID: employee.EmpID,
                    });
                  }}
                >
                  <Text style={styles.text}>
                    {employee.fname} {employee.lname}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.sectionContainer}>
              <Text style={{ textAlign: "center" }}>Nothing To Show</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 100,
    color: "#46aaeb",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#46aaeb",
    borderRadius: 4,
    borderWidth: 2,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 22,
  },
  employee: {
    backgroundColor: "#46aaeb",
    paddingTop: 15,
    paddingBottom: 15,
  },
});
