import request from "../../lib/request"
import { URL } from "../../lib/config"


export function getCompetitionMedia(params) {
	return new Promise((resolve) => {
		request._get(URL.queryCompetitionMedia, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getCompetitionVideo(params) {
	return new Promise((resolve) => {
		request._get(URL.queryCompetitionVideo, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getHistoryAlbums(params) {
	return new Promise((resolve) => {
		request._get(URL.queryHistoryAlbums, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}

export function getHistoryAlbumsById(params) {
	return new Promise((resolve) => {
		request._get(URL.queryHistoryAlbumsById, params).then(({ data }) => {
			data = data || []
			resolve(data)
		})
	})
}
