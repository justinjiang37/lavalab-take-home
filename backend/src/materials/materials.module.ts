import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MaterialsController],
})
export class MaterialsModule {}
