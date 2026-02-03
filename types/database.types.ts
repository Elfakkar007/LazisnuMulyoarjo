// =====================================================
// DATABASE TYPES
// Auto-generated types for Supabase tables
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_profile: {
        Row: {
          id: string
          vision: string
          mission: string
          about: string | null
          whatsapp_number: string | null
          email: string | null
          address: string | null
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          vision: string
          mission: string
          about?: string | null
          whatsapp_number?: string | null
          email?: string | null
          address?: string | null
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          vision?: string
          mission?: string
          about?: string | null
          whatsapp_number?: string | null
          email?: string | null
          address?: string | null
          logo_url?: string | null
          updated_at?: string
        }
      }
      structure_positions: {
        Row: {
          id: string
          position_name: string
          position_order: number
          is_core: boolean
          created_at: string
        }
        Insert: {
          id?: string
          position_name: string
          position_order: number
          is_core?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          position_name?: string
          position_order?: number
          is_core?: boolean
          created_at?: string
        }
      }
      structure_members: {
        Row: {
          id: string
          position_id: string
          name: string
          photo_url: string | null
          dusun: string | null
          member_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          position_id: string
          name: string
          photo_url?: string | null
          dusun?: string | null
          member_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          position_id?: string
          name?: string
          photo_url?: string | null
          dusun?: string | null
          member_order?: number | null
          created_at?: string
        }
      }
      financial_years: {
        Row: {
          id: string
          year: number
          is_active: boolean
          total_income: number
          total_expense: number
          created_at: string
        }
        Insert: {
          id?: string
          year: number
          is_active?: boolean
          total_income?: number
          total_expense?: number
          created_at?: string
        }
        Update: {
          id?: string
          year?: number
          is_active?: boolean
          total_income?: number
          total_expense?: number
          created_at?: string
        }
      }
      kaleng_distribution: {
        Row: {
          id: string
          year_id: string
          month: number
          dusun: string
          total_distributed: number
          total_collected: number
          total_not_collected: number
          created_at: string
        }
        Insert: {
          id?: string
          year_id: string
          month: number
          dusun: string
          total_distributed?: number
          total_collected?: number
          total_not_collected?: number
          created_at?: string
        }
        Update: {
          id?: string
          year_id?: string
          month?: number
          dusun?: string
          total_distributed?: number
          total_collected?: number
          total_not_collected?: number
          created_at?: string
        }
      }
      monthly_income: {
        Row: {
          id: string
          year_id: string
          month: number
          gross_amount: number
          kaleng_wages: number
          spb_cost: number
          jpzis_25_percent: number
          jpzis_75_percent: number
          created_at: string
        }
        Insert: {
          id?: string
          year_id: string
          month: number
          gross_amount: number
          kaleng_wages?: number
          spb_cost?: number
          jpzis_25_percent?: number
          jpzis_75_percent?: number
          created_at?: string
        }
        Update: {
          id?: string
          year_id?: string
          month?: number
          gross_amount?: number
          kaleng_wages?: number
          spb_cost?: number
          jpzis_25_percent?: number
          jpzis_75_percent?: number
          created_at?: string
        }
      }
      program_categories: {
        Row: {
          id: string
          name: string
          percentage: number
          color_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          percentage: number
          color_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          percentage?: number
          color_code?: string | null
          created_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          year_id: string
          category_id: string
          name: string
          description: string | null
          target_audience: string | null
          quantity: string | null
          budget: number
          realization: number
          is_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          year_id: string
          category_id: string
          name: string
          description?: string | null
          target_audience?: string | null
          quantity?: string | null
          budget: number
          realization?: number
          is_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          year_id?: string
          category_id?: string
          name?: string
          description?: string | null
          target_audience?: string | null
          quantity?: string | null
          budget?: number
          realization?: number
          is_completed?: boolean
          created_at?: string
        }
      }
      financial_transactions: {
        Row: {
          id: string
          year_id: string
          category_id: string | null
          transaction_type: 'income' | 'expense'
          description: string
          amount: number
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          year_id: string
          category_id?: string | null
          transaction_type: 'income' | 'expense'
          description: string
          amount: number
          transaction_date: string
          created_at?: string
        }
        Update: {
          id?: string
          year_id?: string
          category_id?: string | null
          transaction_type?: 'income' | 'expense'
          description?: string
          amount?: number
          transaction_date?: string
          created_at?: string
        }
      }
      transaction_templates: {
        Row: {
          id: string
          category_id: string
          template_name: string
          columns: Json
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          template_name: string
          columns: Json
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          template_name?: string
          columns?: Json
          created_at?: string
        }
      }
      transaction_rows: {
        Row: {
          id: string
          year_id: string
          category_id: string
          row_order: number
          row_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          year_id: string
          category_id: string
          row_order: number
          row_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          year_id?: string
          category_id?: string
          row_order?: number
          row_data?: Json
          created_at?: string
        }
      }
      activity_articles: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'Sosial' | 'Kesehatan' | 'Keagamaan'
          excerpt: string | null
          content: string
          featured_image_url: string | null
          activity_date: string
          location: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: 'Sosial' | 'Kesehatan' | 'Keagamaan'
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          activity_date: string
          location?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: 'Sosial' | 'Kesehatan' | 'Keagamaan'
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          activity_date?: string
          location?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_images: {
        Row: {
          id: string
          article_id: string
          image_url: string
          caption: string | null
          image_order: number
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          image_url: string
          caption?: string | null
          image_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          image_url?: string
          caption?: string | null
          image_order?: number
          created_at?: string
        }
      }
      homepage_slides: {
        Row: {
          id: string
          badge: string
          title: string
          detail: string | null
          background_gradient: string | null
          link_url: string | null
          slide_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          badge: string
          title: string
          detail?: string | null
          background_gradient?: string | null
          link_url?: string | null
          slide_order: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          badge?: string
          title?: string
          detail?: string | null
          background_gradient?: string | null
          link_url?: string | null
          slide_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
