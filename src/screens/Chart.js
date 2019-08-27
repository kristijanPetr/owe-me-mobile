import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import axios from 'axios';
import _ from 'lodash';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      months: []
    };
  }

  componentDidMount() {
    this.getExchangeHistory();
  }

  getFormattedDate = () => {
    let date = new Date();
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
  };

  _formatDateToMonthName = date => {
    let new_date = new Date(date); // 2009-11-10
    let month = new_date.toLocaleString('default', { month: 'short' });
    return month;
  };

  getExchangeHistory = () => {
    let url = 'http://www.nbrm.mk/services/ExchangeRates.asmx/GetEXRates';
    let endDate = this.getFormattedDate().replace(/\//g, '.');
    let form_data = {
      endDate,
      isStateAuth: '3',
      startDate: '01.05.2019'
    };

    axios.post(url, form_data).then(resp => {
      if (resp.status !== 200) {
        return;
      }
      let data = resp.data.d;
      let filtered = data.map(item => {
        let { Sreden, Datum } = item['ExchangeRates'].find(
          curr => curr['Oznaka'] === 'USD'
        );
        this._formatDateToMonthName(item['Date']);
        return {
          date: item['Date'],
          value: Sreden,
          month: this._formatDateToMonthName(item['Date'])
        };
      });

      let grouped = _.groupBy(filtered, 'month');

      let months = Object.keys(grouped);
      console.log(months);
      let midValues = months.map(item => {
        let sum = (
          _.sumBy(grouped[item], row => parseFloat(row.value)) /
          grouped[item].length
        ).toFixed(3);

        return sum;
      });

      this.setState({
        months,
        data: midValues
      });
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LineChart
          data={{
            labels: this.state.months,
            datasets: [
              {
                data: this.state.data
              }
            ]
          }}
          width={Dimensions.get('window').width - 20} // from react-native
          height={220}
          yAxisLabel={'$/'}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          onDataPointClick={point => console.log('point click', point)}
        />
      </View>
    );
  }
}

export default Chart;
