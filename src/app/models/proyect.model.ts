
export interface Proyect {
  id: string;
  name: string;
  description: string;
  status: string;
  urlRepository: string;
  plantUmlDiagram: string;
  isPrivate: boolean;
  creationDate: string | null;
  updateDate: string;
  creationUser: string;
  updateUser: string;

  basePath: string;
  port: number;
}


export interface ProyectForm {
  name: string;
  description: string;
  status: string;
  urlRepository?: string;
  plantUmlDiagram?: string;
  isPrivate?: boolean;
  creationUser?: string;
  creationDate?: string;
  updateUser?: string;
  updateDate?: string;

  application: {
    basePath: string;
    port: number;
  };

  documentation: {
    title?: string;
    description?: string;
    version?: string;
    termsOfServiceUrl?: string;
    contactName?: string;
    contactUrl?: string;
    contactEmail?: string;
    licenseName?: string;
    licenseUrl?: string;
  };

  maven: {
    groupId?: string;
    artifactId?: string;
    version?: string;
  };

  security: {
    secretKey?: string;
  };
  classes?: ClassModel[];
}

export interface ClassModel {
  name: string;
  entity: EntityModel;
  apiName?: string;
}

export interface EntityModel {
  tableName: string;
  extendsClass?: string;
  options?: EntityOptions;
  columns: EntityColumn[];
}

export interface EntityOptions {
  inheritanceStrategy?: string;
  uniqueConstraints?: string[];
  discriminator?: Discriminator;
  sequence?: Sequence;
  isAudited?: boolean;
}

export interface Discriminator {
  column: DiscriminatorColumn;
  options?: DiscriminatorOptions;
}

export interface DiscriminatorColumn {
  name: string;
  type: string;
  length?: number;
}

export interface DiscriminatorOptions {
  force?: boolean;
  insert?: boolean;
}

export interface Sequence {
  create: boolean;
  name?: string;
  increment?: number;
}

export interface EntityColumn {
  property: EntityProperty;
  column: ColumnDetails;
  relation?: RelationDetails;
}

export interface EntityProperty {
  name: string;
  type: string;
  visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
}

export interface ColumnDetails {
  name?: string | null;
  length?: number | string | null;
  precision?: number | null;
  scale?: number | null;
  unique?: boolean | null;
  foreignkey?: boolean | null;
  nullable?: boolean | null;
}

export interface RelationDetails {
  type?: string | null;
  fetch?: string | null;
  joinColumnReferenced?: string | null;
  notAudited?: boolean | null;
}

export interface FindAllEntities {
  name: string;
  tableName: String;
  apiName?: string;
}
