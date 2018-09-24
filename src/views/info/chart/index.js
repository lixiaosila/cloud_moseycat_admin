import React,{Component} from 'react'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

import { getCharts } from '@/server'

class ChartShow extends Component {
    state = {
        data: []
    }
    componentDidMount() {
      console.log('12121')
        this.get();
    }
    get() {
        console.log('12')
        getCharts().then(
            res => {
                console.log('res', res);
            }
        )
    }
  render() {
    const data = [
        {
            "count": 1,
            "day": "8-23"
        },
        {
            "count": 2,
            "day": "8-24"
        },
        {
            "count": 3,
            "day": "8-25"
        },
        {
            "count": 4,
            "day": "8-26"
        },
        {
            "count": 5,
            "day": "8-27"
        },
        {
            "count": 6,
            "day": "8-28"
        },
        {
            "count": 7,
            "day": "8-29"
        },
        {
            "count": 8,
            "day": "8-30"
        },
        {
            "count": 9,
            "day": "8-31"
        },
        {
            "count": 10,
            "day": "9-01"
        },
        {
            "count": 11,
            "day": "9-02"
        },
        {
            "count": 8,
            "day": "9-03"
        },
        {
            "count": 6,
            "day": "9-04"
        },
        {
            "count": 5,
            "day": "9-05"
        },
        {
            "count": 4,
            "day": "9-06"
        },
        {
            "count": 3,
            "day": "9-07"
        },
        {
            "count": 1,
            "day": "9-08"
        },
        {
            "count": 2,
            "day": "9-09"
        },
        {
            "count": 9,
            "day": "9-10"
        },
        {
            "count": 12,
            "day": "9-11"
        },
        {
            "count": 13,
            "day": "9-12"
        },
        {
            "count": 20,
            "day": "9-13"
        },
        {
            "count": 19,
            "day": "9-14"
        },
        {
            "count": 0,
            "day": "9-15"
        },
        {
            "count": 12,
            "day": "9-16"
        },
        {
            "count": 13,
            "day": "9-17"
        },
        {
            "count": 12,
            "day": "9-18"
        },
        {
            "count": 0,
            "day": "9-19"
        },
        {
            "count": 0,
            "day": "9-20"
        },
        {
            "count": 0,
            "day": "9-21"
        },
        {
            "count": 0,
            "day": "9-22"
        },
        {
            "count": 0,
            "day": "9-23"
        }
    ];
    return (
      <div>
        <Chart height={window.innerHeight} data={data} forceFit>
          <Axis name="day" />
          <Axis name="count" />
          <Tooltip
            containerTpl="<div class=&quot;g2-tooltip&quot;><p class=&quot;g2-tooltip-title&quot;></p><table class=&quot;g2-tooltip-list&quot;></table></div>"
            itemTpl="<tr class=&quot;g2-tooltip-list-item&quot;><td style=&quot;color:{color}&quot;>{name}</td><td>{value}</td></tr>"
            offset={50}
            g2-tooltip={{
              position: "absolute",
              visibility: "hidden",
              border: "1px solid #efefef",
              backgroundColor: "white",
              color: "#000",
              opacity: "0.8",
              padding: "5px 15px",
              transition: "top 200ms,left 200ms"
            }}
            g2-tooltip-list={{
              margin: "10px"
            }}
          />
          <Geom type="line" position="day*count" />
        </Chart>
      </div>
    );
  }
}

export default ChartShow;
