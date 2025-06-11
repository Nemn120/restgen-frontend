
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
}
