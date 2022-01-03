import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import validator from "validator";
import isValidMentor, {
  isValidMentorInterface,
} from "../helpers/validate.helper";

const createMentor = (
  data: MentorInterface,
  cb: { (mentor: MentorInterface): void }
): Promise<MentorInterface> => {
  return new Promise((resolve, reject) => {
    const {
      isValid,
      errs,
      data: finalData,
    }: isValidMentorInterface = isValidMentor(data);

    if (isValid) {
      resolve(new mentorModel(finalData));
    } else {
      reject(errs);
    }
  });
};
