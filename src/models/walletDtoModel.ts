export class WalletDtoModel {
  id: string;
  name: string;
  type: string;
  description: string;
  apiKey: string;
  apiv2Only: boolean;

  constructor(dto: any) {
    this.id = dto.Id;
    this.name = dto.Name;
    this.type = dto.Type;
    this.description = dto.Description;
    this.apiKey = dto.ApiKey;
    this.apiv2Only = dto.Apiv2Only;
  }
}
