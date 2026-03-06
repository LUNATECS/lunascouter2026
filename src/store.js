import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Helper to load legacy data from previous version
const loadLegacyData = () => {
  if (typeof window === 'undefined') return {}
  try {
    const stateRaw = localStorage.getItem('luna_v2_state')
    const archivesRaw = localStorage.getItem('luna_v2_archives')
    
    const state = stateRaw ? JSON.parse(stateRaw) : {}
    const archives = archivesRaw ? JSON.parse(archivesRaw) : []
    
    return {
      teams: state.teams || [],
      records: state.records || [],
      allianceSelection: state.allianceSelection || state.bannerSelection || '',
      matchNumber: state.matchNumber || '',
      scoutName: state.scoutName || '',
      archives: archives
    }
  } catch (e) {
    console.warn('Failed to load legacy data', e)
    return {}
  }
}

const legacy = loadLegacyData()

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      teams: legacy.teams || [],
      records: legacy.records || [],
      archives: legacy.archives || [],
      allianceSelection: legacy.allianceSelection || '',
      matchNumber: legacy.matchNumber || '',
      scoutName: legacy.scoutName || '',

      // Actions
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => {
        const newTeams = [...state.teams, team]
        return { teams: newTeams.sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0)) }
      }),
      deleteTeam: (index) => set((state) => ({ teams: state.teams.filter((_, i) => i !== index) })),
      
      setRecords: (records) => set({ records }),
      addRecord: (record) => set((state) => ({ records: [...state.records, record] })),
      clearRecords: () => set({ records: [] }),
      
      updateRecordNote: (index, note) => set((state) => {
        // We need to handle the index carefully as the UI reverses the array
        // The index passed here should be the "real" index in the source array
        const newRecords = [...state.records]
        const r = newRecords[index]
        if (!r) return {}
        
        if (r.values) {
           r.values.teleopNote = note
        } else {
           r.teleopNote = note
        }
        return { records: newRecords }
      }),
      
      toggleRecordDiscard: (index) => set((state) => {
        const newRecords = [...state.records]
        const r = newRecords[index]
        if (!r) return {}

        if (r.discarded === undefined && r.values && r.values.discarded !== undefined) {
            r.discarded = !r.values.discarded
            delete r.values.discarded
        } else {
            r.discarded = !r.discarded
        }
        return { records: newRecords }
      }),

      setArchives: (archives) => set({ archives }),
      addArchive: (archive) => set((state) => ({ archives: [archive, ...state.archives] })),
      deleteArchive: (id) => set((state) => ({ archives: state.archives.filter(a => a.id !== id) })),

      setAllianceSelection: (selection) => set({ allianceSelection: selection }),
      setMatchNumber: (matchNumber) => set({ matchNumber }),
      setScoutName: (scoutName) => set({ scoutName }),
    }),
    {
      name: 'luna_scouter_storage', // New unified storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
