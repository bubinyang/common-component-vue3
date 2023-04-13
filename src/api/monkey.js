import request from "@/utils/request";

export function getMonkeyData(query) {
  return request({
    url: "/getMonkeyHisData",
    method: "get",
    params: query
  });
}
