import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const authStore=create(
    persist(
        (set)=>(
            {
                user:null,
                setUser:(data)=>set((state)=>{
                    return {
                        user: {
                            ...state.user,
                            ...data
                        }
                    }
                }),
                logout:()=>set({user:null})
            }
        )
    )
)

export default authStore;