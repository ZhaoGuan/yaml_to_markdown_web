import request from '@/utils/request'

const host = "http://0.0.0.0:8000"

export function addAttribute(data) {
  return request({
    url: host + '/to_yaml/add_attribute',
    method: 'post',
    data
  })
}

export function getAttributes() {
  return request({
    url: host + '/to_yaml/get_attributes',
    method: 'get'
  })
}

export function delAttribute(info) {
  return request({
    url: host + '/to_yaml/del_attributes?info=' + info,
    method: 'get'
  })
}

export function crateElement(data) {
  return request({
    url: host + '/to_yaml/create_element',
    method: 'post',
    data
  })
}

export function getAllElements() {
  return request({
    url: host + '/to_yaml/get_elements_info',
    method: 'get',
  })
}

export function delElement(the_id) {
  return request({
    url: host + '/to_yaml/del_element?id=' + the_id,
    method: 'get'
  })
}
