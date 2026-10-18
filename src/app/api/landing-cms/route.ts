import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { DEFAULT_LANDING_CMS } from '@/config/landing-cms-defaults'
import { LandingCMSData } from '@/types/landing-cms'

const DATA_DIR = path.resolve(process.cwd(), 'src/data')
const DATA_FILE = path.join(DATA_DIR, 'landing-cms.json')

function ensureDataFile(): LandingCMSData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_LANDING_CMS, null, 2), 'utf-8')
      return DEFAULT_LANDING_CMS
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    // Deep merge with defaults so newly added keys are always present
    return {
      ...DEFAULT_LANDING_CMS,
      ...parsed,
      offerBanner: { ...DEFAULT_LANDING_CMS.offerBanner, ...(parsed.offerBanner || {}) },
      hero: { ...DEFAULT_LANDING_CMS.hero, ...(parsed.hero || {}) },
      stats: { ...DEFAULT_LANDING_CMS.stats, ...(parsed.stats || {}) },
      pricing: { ...DEFAULT_LANDING_CMS.pricing, ...(parsed.pricing || {}) },
      features: { ...DEFAULT_LANDING_CMS.features, ...(parsed.features || {}) },
      faq: { ...DEFAULT_LANDING_CMS.faq, ...(parsed.faq || {}) },
      contact: { ...DEFAULT_LANDING_CMS.contact, ...(parsed.contact || {}) },
    }
  } catch (error) {
    console.warn('[Landing CMS API] Error reading data file, falling back to defaults:', error)
    return DEFAULT_LANDING_CMS
  }
}

function saveDataFile(data: LandingCMSData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[Landing CMS API] Error saving data file:', error)
    throw error
  }
}

export async function GET() {
  try {
    const data = ensureDataFile()
    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch CMS data', data: DEFAULT_LANDING_CMS },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.action === 'reset') {
      saveDataFile(DEFAULT_LANDING_CMS)
      return NextResponse.json({ success: true, data: DEFAULT_LANDING_CMS, message: 'Reset to defaults successfully' })
    }

    const updatedData: LandingCMSData = {
      ...DEFAULT_LANDING_CMS,
      ...body,
      lastUpdated: new Date().toISOString(),
      version: (body.version || 1) + 1,
    }

    saveDataFile(updatedData)
    return NextResponse.json({ success: true, data: updatedData, message: 'Landing page content updated successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update CMS data' },
      { status: 500 }
    )
  }
}
