"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentificationType = exports.OrganizationType = void 0;
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["NATURAL_PERSON"] = "NATURAL_PERSON";
    OrganizationType["PERSON_JURIDIC"] = "PERSON_JURIDIC";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
var IdentificationType;
(function (IdentificationType) {
    IdentificationType["CITIZEN_ID"] = "CITIZEN_ID";
    IdentificationType["NIT"] = "NIT";
    IdentificationType["PASSPORT"] = "PASSPORT";
    IdentificationType["TAX_ID"] = "TAX_ID";
    IdentificationType["FOREIGN_ID"] = "FOREIGN_ID";
})(IdentificationType || (exports.IdentificationType = IdentificationType = {}));
