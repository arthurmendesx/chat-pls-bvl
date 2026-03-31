import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class WhatsAppContactProfile {
  @IsString()
  name!: string;
}

class WhatsAppContact {
  @ValidateNested()
  @Type(() => WhatsAppContactProfile)
  profile!: WhatsAppContactProfile;

  @IsString()
  wa_id!: string;
}

class WhatsAppTextContent {
  @IsString()
  body!: string;
}

class WhatsAppMessage {
  @IsString()
  from!: string;

  @IsString()
  id!: string;

  @IsString()
  timestamp!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsAppTextContent)
  text?: WhatsAppTextContent;

  @IsString()
  type!: string;
}

class WhatsAppMetadata {
  @IsString()
  display_phone_number!: string;

  @IsString()
  phone_number_id!: string;
}

class WhatsAppChangeValue {
  @IsString()
  messaging_product!: string;

  @ValidateNested()
  @Type(() => WhatsAppMetadata)
  metadata!: WhatsAppMetadata;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppContact)
  contacts?: WhatsAppContact[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessage)
  messages?: WhatsAppMessage[];
}

class WhatsAppChange {
  @ValidateNested()
  @Type(() => WhatsAppChangeValue)
  value!: WhatsAppChangeValue;

  @IsString()
  field!: string;
}

class WhatsAppEntry {
  @IsString()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppChange)
  changes!: WhatsAppChange[];
}

export class WebhookPayloadDto {
  @IsString()
  object!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppEntry)
  entry!: WhatsAppEntry[];
}
