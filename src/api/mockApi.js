export function mockRequest(data, delay = 400) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data
      })
    }, delay)
  })
}