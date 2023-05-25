import request from "@/utils/request";

export function getMonkeyData(query) {
  return request({
    url: "/getMonkeyHisData",
    method: "get",
    params: query
  });
}

export function findRealTimeData(query) {
  return request({
    url: "/findRealTimeData",
    method: "get",
    params: query
  });
}
