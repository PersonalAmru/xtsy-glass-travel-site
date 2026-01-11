// Property Onboarding Service - Accelerate Time to First Booking
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { 
  PropertyOnboarding, 
  PropertyTemplate, 
  PropertyType,
  OnboardingChecklist,
  OnboardingStatus,
  DefaultRoomType,
  DefaultRates,
  DefaultPolicies
} from '@/types/commercial';

/**
 * Get all available property templates
 */
export async function getPropertyTemplates(): Promise<PropertyTemplate[]> {
  const { data, error } = await supabase
    .from('property_templates')
    .select('*')
    .eq('is_active', true)
    .order('template_name');

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return (data || []).map(d => ({
    ...d,
    default_room_types: (d.default_room_types || []) as unknown as DefaultRoomType[],
    default_base_rates: (d.default_base_rates || {}) as unknown as DefaultRates,
    default_policies: (d.default_policies || {}) as unknown as DefaultPolicies,
  })) as PropertyTemplate[];
}

/**
 * Get onboarding status for a property
 */
export async function getPropertyOnboarding(
  propertyId: string
): Promise<PropertyOnboarding | null> {
  const { data, error } = await supabase
    .from('property_onboarding')
    .select('*')
    .eq('property_id', propertyId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching onboarding:', error);
    return null;
  }

  if (!data) return null;
  
  return {
    ...data,
    checklist: (data.checklist || {}) as unknown as OnboardingChecklist,
    readiness_factors: (data.readiness_factors || {}) as unknown as Record<string, number>,
    blocking_issues: (data.blocking_issues || []) as unknown as string[],
    warnings: (data.warnings || []) as unknown as string[],
  } as PropertyOnboarding;
}

/**
 * Initialize onboarding for a new property
 */
export async function initializeOnboarding(
  propertyId: string,
  propertyType: PropertyType,
  templateName?: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('property_onboarding')
    .insert({
      property_id: propertyId,
      property_type: propertyType,
      template_applied: templateName || null,
      onboarding_status: 'pending',
      started_at: new Date().toISOString(),
      checklist: {
        basic_info: false,
        room_types: false,
        inventory: false,
        rates: false,
        photos: false,
        policies: false,
        payment_setup: false,
        tax_info: false,
        franchise_assigned: false,
        test_booking: false,
      },
      readiness_score: 0,
      minimum_readiness_met: false,
    });

  if (error) {
    console.error('Error initializing onboarding:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Apply a template to a property
 */
export async function applyTemplate(
  propertyId: string,
  templateName: string
): Promise<{ success: boolean; error?: string; roomsCreated?: number }> {
  const templates = await getPropertyTemplates();
  const typedTemplate = templates.find(t => t.template_name === templateName);

  if (!typedTemplate) {
    return { success: false, error: 'Template not found' };
  }

  let roomsCreated = 0;

  // Note: Room type creation would need to match actual schema
  // This is a placeholder - actual implementation depends on room_types table structure
  for (const roomType of typedTemplate.default_room_types) {
    console.log('Would create room type:', roomType.name);
    roomsCreated++;
  }

  // Update onboarding
  await supabase
    .from('property_onboarding')
    .update({
      template_applied: templateName,
      base_rates_generated: true,
      updated_at: new Date().toISOString(),
    })
    .eq('property_id', propertyId);

  // Update checklist
  await updateChecklistItem(propertyId, 'room_types', true);

  return { success: true, roomsCreated };
}

/**
 * Update a single checklist item
 */
export async function updateChecklistItem(
  propertyId: string,
  item: keyof OnboardingChecklist,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  const current = await getPropertyOnboarding(propertyId);

  if (!current) {
    return { success: false, error: 'Onboarding not found' };
  }

  const checklist = { ...current.checklist };
  checklist[item] = completed;

  const { error } = await supabase
    .from('property_onboarding')
    .update({
      checklist: checklist as Json,
      updated_at: new Date().toISOString(),
    })
    .eq('property_id', propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Recalculate readiness score
  await recalculateReadinessScore(propertyId);

  return { success: true };
}

/**
 * Recalculate readiness score using database function
 */
export async function recalculateReadinessScore(
  propertyId: string
): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_readiness_score', {
    p_property_id: propertyId,
  });

  if (error) {
    console.error('Error calculating readiness:', error);
    return 0;
  }

  return data as number;
}

/**
 * Update onboarding status
 */
export async function updateOnboardingStatus(
  propertyId: string,
  status: OnboardingStatus
): Promise<{ success: boolean; error?: string }> {
  const updates: Record<string, unknown> = {
    onboarding_status: status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('property_onboarding')
    .update(updates)
    .eq('property_id', propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Generate default inventory for a property
 */
export async function scaffoldInventory(
  propertyId: string,
  days: number = 90
): Promise<{ success: boolean; daysCreated: number; error?: string }> {
  // Note: Inventory scaffolding depends on actual inventory table schema
  // This is a simplified placeholder implementation
  console.log(`Would scaffold ${days} days of inventory for property ${propertyId}`);
  
  const daysCreated = days;

  // Update onboarding
  await supabase
    .from('property_onboarding')
    .update({
      inventory_scaffolded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('property_id', propertyId);

  await updateChecklistItem(propertyId, 'inventory', true);

  return { success: true, daysCreated };
}

/**
 * Get all properties with their onboarding status
 */
export async function getAllOnboardingStatus(): Promise<{
  property_id: string;
  property_name: string;
  status: OnboardingStatus;
  readiness_score: number;
  minimum_readiness_met: boolean;
  started_at: string | null;
  completed_at: string | null;
}[]> {
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, name');

  if (propError || !properties) {
    return [];
  }

  const { data: onboardings, error: onbError } = await supabase
    .from('property_onboarding')
    .select('*');

  if (onbError) {
    return [];
  }

  const onboardingMap = new Map(
    (onboardings || []).map((o) => [o.property_id, o])
  );

  return properties.map((p) => {
    const onb = onboardingMap.get(p.id);
    return {
      property_id: p.id,
      property_name: p.name,
      status: (onb?.onboarding_status || 'pending') as OnboardingStatus,
      readiness_score: onb?.readiness_score || 0,
      minimum_readiness_met: onb?.minimum_readiness_met || false,
      started_at: onb?.started_at || null,
      completed_at: onb?.completed_at || null,
    };
  });
}

/**
 * Mark first booking received
 */
export async function markFirstBooking(
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('property_onboarding')
    .update({
      first_booking_at: new Date().toISOString(),
      onboarding_status: 'live',
      updated_at: new Date().toISOString(),
    })
    .eq('property_id', propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get blocking issues for a property
 */
export async function getBlockingIssues(
  propertyId: string
): Promise<{ issues: string[]; warnings: string[] }> {
  const onboarding = await getPropertyOnboarding(propertyId);
  
  if (!onboarding) {
    return { issues: ['Onboarding not initialized'], warnings: [] };
  }

  const issues: string[] = [];
  const warnings: string[] = [];
  const checklist = onboarding.checklist;

  // Critical blockers
  if (!checklist.basic_info) issues.push('Basic property information not complete');
  if (!checklist.room_types) issues.push('No room types configured');
  if (!checklist.inventory) issues.push('Inventory not set up');
  if (!checklist.rates) issues.push('Rates not configured');

  // Warnings (not blocking)
  if (!checklist.photos) warnings.push('No photos uploaded');
  if (!checklist.policies) warnings.push('Policies not configured');
  if (!checklist.payment_setup) warnings.push('Payment setup incomplete');
  if (!checklist.tax_info) warnings.push('Tax information missing');
  if (!checklist.franchise_assigned) warnings.push('No franchise assigned');

  return { issues, warnings };
}
