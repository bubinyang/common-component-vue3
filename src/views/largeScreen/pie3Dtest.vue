<!--
options3d-alpha 可以调整倾斜角度
-->
<template>
  <div style="width: 436px; height: 352px" id="container"></div>
</template>
<script setup>
// [{"name":"电用量","unit":"万kWh","y":220000,"h":0,"valueY":22},{"name":"水用量","unit":"m³","y":4873.6,"h":5,"valueY":4873.6},{"name":"蒸汽用量","unit":"m³","y":3966.9,"h":10,"valueY":3966.9}]
import Highcharts from "highcharts";
import {
  reactive,
  watch,
  getCurrentInstance,
  inject,
  ref,
  nextTick,
  computed,
  onMounted
} from "vue";
import moment from "moment";

var each = Highcharts.each,
  round = Math.round,
  cos = Math.cos,
  sin = Math.sin,
  deg2rad = Math.deg2rad;
Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, "translate", function (proceed) {
  proceed.apply(this, [].slice.call(arguments, 1));
  // Do not do this if the chart is not 3D
  if (!this.chart.is3d()) {
    return;
  }
  var series = this,
    chart = series.chart,
    options = chart.options,
    seriesOptions = series.options,
    depth = seriesOptions.depth || 0,
    options3d = options.chart.options3d,
    alpha = options3d.alpha,
    beta = options3d.beta,
    z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
  z += depth / 2;
  if (seriesOptions.grouping !== false) {
    z = 0;
  }
  each(series.data, function (point) {
    var shapeArgs = point.shapeArgs,
      angle;
    point.shapeType = "arc3d";
    var ran = point.options.h;
    shapeArgs.z = z;
    shapeArgs.depth = depth * 0.75 + ran;
    shapeArgs.alpha = alpha;
    shapeArgs.beta = beta;
    shapeArgs.center = series.center;
    shapeArgs.ran = ran;
    angle = (shapeArgs.end + shapeArgs.start) / 2;
    point.slicedTranslation = {
      translateX: round(cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
      translateY: round(sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad))
    };
  });
});
(function (H) {
  H.wrap(Highcharts.SVGRenderer.prototype, "arc3dPath", function (proceed) {
    // Run original proceed method
    var ret = proceed.apply(this, [].slice.call(arguments, 1));
    ret.zTop = (ret.zOut + 0.5) / 100;
    return ret;
  });
})(Highcharts);

onMounted(() => {
  Highcharts.chart("container", {
    chart: {
      type: "pie",
      accessibility: {
        enabled: false
      },
      reflow: true,
      backgroundColor: "rgba(0, 0, 0, 0)",
      events: {
        load: function () {
          const each = Highcharts.each;
          const points = this.series[0].points;
          each(points, function (p, i) {
            p.graphic.attr({
              translateY: -p.shapeArgs.ran
            });
            p.graphic.side1.attr({
              translateY: -p.shapeArgs.ran
            });
            p.graphic.side2.attr({
              translateY: -p.shapeArgs.ran
            });
          });
        }
      },
      options3d: {
        enabled: true,
        alpha: 65,
        beta: 0
      }
    },
    plotOptions: {
      pie: {
        // innerSize: 60,
        depth: 25,
        allowPointSelect: false,
        cursor: "pointer",
        // depth: 35,
        // innerSize: 90,
        // size: 160,
        showInLegend: true, // 显示图例
        size: "83%", // 外圈直径大小
        innerSize: 150, // 内圈直径大小
        center: ["50%", "72%"],
        dataLabels: {
          enabled: false,
          // format: `<b>{point.name}</b> + <b style='color: #ffffff'>{point.percentage:.1f} %</b><\n><`,
          formatter: function () {
            return (
              "<span style='color: #ffffff'>" +
              this.point.name +
              "</span> " +
              "<span style='color: #2B95CC'>" +
              this.percentage.toFixed(2) +
              "%</span><br/><span style='color: #2B95CC'>" +
              this.point.valueY +
              " " +
              this.point.unit +
              "</span>"
            );
          },
          connectorColor: "#02AAD0",
          style: {
            textOverflow: "ellipsis"
          }
        }
      }
    },

    legend: {
      itemStyle: {
        color: "#00C8FF",
        fontSize: "12px"
      },
      itemHoverStyle: { color: "#34dcfc" },
      symbolWidth: 20,
      symbolHeight: 15,
      symbolRadius: 3,
      itemWidth: 100,
      itemMarginTop: 15,
      floating: true,
      y: -240
    },

    tooltip: {
      animation: true,
      // pointFormat: `<b>{series.name}<br/>电用量:{point.y} <br/>占比:{point.percentage:.1f}%</b>`,
      pointFormat: `
     <span style="color:white">总量</span> <b style="color:#27FFA9;padding-left:10px'">{point.y}</b> tce<br/>
  
     <span style="color:white">占比</span> <b style="color:#27FFA9;padding-left:10px'">{point.percentage:.1f}</b> %
     `,
      borderColor: "#0061FF",
      backgroundColor: "rgba(36,81,214,0.5)",

      style: {
        color: "#1DFFFF",
        padding: "24px"
      }
    },
    credits: {
      enabled: false
    },
    title: {
      show: "false",
      text: ""
    },
    subtitle: {
      text: ""
    },

    series: [
      {
        type: "pie",
        name: "Browser share",
        data: [
          {
            name: "Firefox",
            y: 30.0,
            h: 10,
            color: "rgba(231,225,41,0.5)"
          },
          {
            name: "IE",
            y: 26.8,
            h: 20,
            color: "rgba(232,114,76,0.5)"
          },
          {
            name: "Chrome",
            y: 12.8,
            h: 40,
            color: "rgba(214,83,240,0.5)"
          },
          {
            name: "Safari",
            y: 20,
            h: 60,
            color: "rgba(5,187,183,0.5)"
          }
          //   {
          //     name: "Opera",
          //     y: 6.2,
          //     h: 15
          //   },
          //   {
          //     name: "Others",
          //     y: 0.7,
          //     h: 30
          //   }
        ]
      }
    ]
  });
});
</script>
<style lang="less" scoped>
#container {
  //   background-image: url("@/assets/images/largreen-board/di.png");
  //   background-repeat: no-repeat;
  //   background-position: 53% 102%;
  //   background-size: 90%;
}
</style>
