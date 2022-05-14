// 获取内网Ip
// export function
import Cookies from 'js-cookie'

const IpKey = 'Admin-ip'

export function getIP() {
  let ip = Cookies.get(IpKey)
  if (ip == null || ip == '' || ip == 'undefined') {
    getLocalIP().then((ipAddr) => {
      Cookies.set(IpKey, ipAddr)
      ip = ipAddr
    });
  }
  return ip
}

export const getLocalIP = (logInfo = true) => new Promise((resolve, reject) => {
  window.RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection
    || window.webkitRTCPeerConnection

  if (typeof window.RTCPeerConnection == 'undefined') {
    return reject('WebRTC not supported by browser')
  }

  let pc = new RTCPeerConnection()
  let ips = []

  pc.createDataChannel('')
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .catch(err => reject(err))
  pc.onicecandidate = event => {
    if (!event || !event.candidate) {
      // All ICE candidates have been sent.
      if (ips.length == 0) {
        return reject('WebRTC disabled or restricted by browser')
      }

      return resolve(ips[0])
    }

    let parts = event.candidate.candidate.split(' ')
    let [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts
    if (!ips.some(e => e == base)) {
      ips.push(base.split(':')[1])
    }

    if (!logInfo) {
      return;
    }
  };
});
