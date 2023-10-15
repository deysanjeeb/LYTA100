// screens/LandingPage.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ChatbotIcon from "../components/ChatbotIcon";
import { LineChart, BarChart } from "react-native-chart-kit";
import { appleHealthData } from "../assets/appleHealthData";
import { ScrollView } from "react-native";

function mapKeysToLastPart(obj) {
  const result = {};

  function map(current, parentKey) {
    if (Object(current) !== current) {
      const lastPart = parentKey.split(".").pop();
      result[lastPart] = current;
    } else if (Array.isArray(current)) {
      current.forEach((item, index) => {
        map(item, `${parentKey}[${index}]`);
      });
    } else {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          map(current[key], `${parentKey ? parentKey + "." : ""}${key}`);
        }
      }
    }
  }

  map(obj, "");
  return result;
}
function flattenObjectWithLastKey(obj) {
  let result = {};
  function recurse(curr, prop) {
    if (Object(curr) !== curr) {
      result[prop] = curr;
    } else if (Array.isArray(curr)) {
      for (let i = 0, l = curr.length; i < l; i++) {
        recurse(curr[i], prop + "[" + i + "]");
      }
      if (curr.length == 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (let p in curr) {
        isEmpty = false;
        recurse(curr[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }
  recurse(obj, "");
  return result;
}

const LandingPage = ({ navigation }) => {
  const [keywordMappedTo, setKeywordMappedTo] = useState();
  const [labels, setLabels] = useState();
  const [chartData, setChartData] = useState();
  const [historicalCharts, setHistoricalCharts] = useState();

  useEffect(() => {
    // const apiUrl = "https://api.example.com/data";
    // fetch(apiUrl)
    //   .then((responseKeyword) => {

    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
    let historicalDataMap = [];
    let dateField = [];
    let metricField = [];

    for (const item of appleHealthData) {
      const flattenedObject = flattenObjectWithLastKey(item);
      const restructuredObj = mapKeysToLastPart(flattenedObject);
      dateField.push(restructuredObj.date);
      metricField.push(restructuredObj.steps);
    }
    setLabels(dateField);
    setChartData([
      {
        data: metricField,
      },
    ]);
    setHistoricalCharts([
      { date: dateField, data: [{ data: metricField }] },
      { date: dateField, data: [{ data: metricField }] },
      { date: dateField, data: [{ data: metricField }] },
    ]);
  }, []);

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome to the Landing Page!</Text>
    //   {/* <Button
    //     title="Logout"
    //     onPress={() => {
    //       // Add any logout logic here if needed
    //       navigation.navigate("Login");
    //     }}
    //   /> */}
    //   <ChatbotIcon />
    // </View>
    <ScrollView>
      <View style={styles.container}>
        <Text>Bezier Line Chart</Text>
        {historicalCharts &&
          historicalCharts.map((chart) => (
            <LineChart
              data={{
                labels: chart.date,
                datasets: chart.data,
              }}
              width={400} // from react-native
              height={400}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ))}
        <ChatbotIcon />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default LandingPage;
