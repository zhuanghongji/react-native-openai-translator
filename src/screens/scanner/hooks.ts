import { useCallback, useEffect, useMemo, useState } from 'react'
import { Camera, CameraDevice } from 'react-native-vision-camera'

type CameraDeviceList = CameraDevice[]

export function useScanCameraDevice(): {
  device: CameraDevice | undefined
  deviceText: string
  devices: CameraDeviceList
  nextDevice: () => void
} {
  const [index, setIndex] = useState(0)
  const [devices, setDevices] = useState<CameraDeviceList>([])
  const nextDevice = useCallback(() => {
    const { length } = devices
    if (length < 2) {
      return
    }
    // 0 % 3 = 0
    // 1 % 3 = 1
    // 2 % 3 = 3
    // 3 % 3 = 0
    setIndex((index + 1) % length)
  }, [index, devices])

  const device = devices[index]
  const deviceText = useMemo<string>(() => {
    if (!device) {
      return ''
    }
    if (device.devices.includes('ultra-wide-angle-camera')) {
      return '0.5'
    }
    if (device.devices.includes('wide-angle-camera')) {
      return '1.0'
    }
    return '2.x'
  }, [device])

  useEffect(() => {
    let isMounted = true

    const loadDevice = async (): Promise<void> => {
      const ds = await Camera.getAvailableCameraDevices()
      if (!isMounted) {
        return
      }
      const _devices = ds
        .filter(d => d.position === 'back' && !d.isMultiCam)
        .sort(({ devices: [a] }, { devices: [b] }) => {
          if (a === 'ultra-wide-angle-camera' && b !== 'ultra-wide-angle-camera') {
            return -1
          }
          if (a === 'wide-angle-camera' && b === 'telephoto-camera') {
            return -1
          }
          if (a === b) {
            return 0
          }
          return 1
        })
      const _index = _devices.findIndex(d => d.devices.includes('wide-angle-camera'))
      if (_index >= 0) {
        setIndex(_index)
      }
      setDevices(_devices)
    }
    loadDevice()

    return () => {
      isMounted = false
    }
  }, [setIndex, setDevices])

  return {
    device,
    deviceText,
    devices,
    nextDevice,
  }
}
