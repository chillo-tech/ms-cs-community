import {axiosInstance} from "./axios-instance"
/* eslint-disable @typescript-eslint/no-explicit-any */

const deleteItem = (endpoint: string) => {
	return axiosInstance.delete(endpoint)
}

const add = (endpoint: string, data: any) => {
    const result = axiosInstance.post(
      `${endpoint}`,
      data,
      {
        headers: {"Content-Type": "application/json"}
      }
    )
    return result;
}

const patch = (endpoint: string, data: any) => {
	return axiosInstance.patch(
		endpoint,
		data,
		{
			headers: {"Content-Type": "application/json"}
		}
	)
}

const search = (endpoint: string) => {
	return axiosInstance.get(endpoint)
}

// const createRelation = (en)

export {add, search, patch, deleteItem}
