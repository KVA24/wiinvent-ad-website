import type { AdFormat, Device, FormatType } from '@/data/formats'

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function filterFormats(
  formats: AdFormat[],
  query: { devices: Device[]; types: FormatType[]; search: string },
  nameOf: (format: AdFormat) => string,
): AdFormat[] {
  const search = normalize(query.search)

  return formats.filter((format) => {
    const matchesDevices =
      query.devices.length === 0 || query.devices.some((device) => format.devices.includes(device))
    const matchesTypes = query.types.length === 0 || query.types.includes(format.type)
    const matchesSearch = search === '' || normalize(nameOf(format)).includes(search)

    return matchesDevices && matchesTypes && matchesSearch
  })
}
