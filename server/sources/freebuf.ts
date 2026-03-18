interface FreebufArticle {
  ID: string
  post_title: string
  post_date: string
  username: string
  nickname: string
  user_img: string
  content: string
  post_image: string
  url: string
  read_count: number
  like: number
  favorite: number
  is_original: boolean
}

interface FreebufResponse {
  data: {
    total_count: number
    data_list: FreebufArticle[]
  }
  code: number
  msg: string
}

export default defineSource(async () => {
  const categories = [
    { name: "web", category: "Web安全" },
    { name: "container", category: "云安全" },
    { name: "ai-security", category: "AI安全" },
    { name: "endpoint", category: "终端安全" },
    { name: "database", category: "数据安全" },
    { name: "development", category: "开发安全" },
    { name: "network", category: "基础安全" },
    { name: "es", category: "企业安全" },
    { name: "ics-articles", category: "关键基础设施安全" },
    { name: "mobile", category: "移动安全" },
    { name: "system", category: "系统安全" },
    { name: "others-articles", category: "其他安全" },
  ]

  const articles: any[] = []

  for (const cat of categories) {
    try {
      const apiUrl = `https://www.freebuf.com/fapi/frontend/category/list?name=${cat.name}&page=1&limit=20&select=0&order=0&type=category`
      const response = await myFetch<FreebufResponse>(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Referer": "https://www.freebuf.com/",
          "Accept": "application/json",
        },
      })

      if (response?.data?.data_list) {
        for (const item of response.data.data_list) {
          articles.push({
            id: item.ID,
            title: item.post_title,
            url: `https://www.freebuf.com${item.url}`,
            extra: {
              hover: item.content,
              time: item.post_date,
              author: {
                name: item.nickname || item.username,
                avatar: item.user_img,
              },
              stats: {
                views: item.read_count,
                collections: item.favorite,
              },
              category: cat.category,
              isOriginal: item.is_original,
            },
          })
        }
      }
    } catch (error) {
      console.warn(`获取 ${cat.category} 分类失败:`, error instanceof Error ? error.message : String(error))
    }
  }

  return articles
})
