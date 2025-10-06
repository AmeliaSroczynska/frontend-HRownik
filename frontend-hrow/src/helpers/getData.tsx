import { faker } from "@faker-js/faker";

export function getData() {
  const array = [];
  for (let i = 0; i < 20; i++) {
    array.push({
      id: i,
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      index: faker.string.alphanumeric(5).toUpperCase(),
      fieldOfStudy: faker.helpers.arrayElement([
        "Computer Science",
        "Math",
        "Physics",
      ]),
      section: faker.string.alphanumeric(2).toUpperCase(),
    });
  }
  return array;
}

export function getFinance() {
  const array = [];
  for (let i = 0; i < 5; i++) {
    array.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: faker.word.noun(5),
      amount: Math.floor(Math.random() * 20),
      workerId: i + 1,
    });
  }
  return array;
}
