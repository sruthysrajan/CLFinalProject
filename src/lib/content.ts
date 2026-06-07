import askContactsData from "@/data/ask-contacts.json";
import contentMetaData from "@/data/content-meta.json";
import faqsData from "@/data/faqs.json";
import officialSourcesData from "@/data/official-sources.json";
import studentTipsData from "@/data/student-tips.json";
import tasksData from "@/data/tasks.json";
import topicsData from "@/data/topics.json";
import type {
  AskContact,
  ContentMeta,
  FaqItem,
  OfficialSource,
  StudentTip,
  Task,
  TaskId,
  Topic,
  TopicId,
} from "@/types/content";

const tasks = tasksData as Task[];
const topics = topicsData as Topic[];
const officialSources = officialSourcesData as OfficialSource[];
const studentTips = studentTipsData as StudentTip[];
const askContacts = askContactsData as AskContact[];
const faqs = faqsData as FaqItem[];
const contentMeta = contentMetaData as ContentMeta;

function createIdMap<T extends { id: string }>(items: readonly T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function getByIds<T extends { id: string }>(
  itemsById: ReadonlyMap<string, T>,
  ids: readonly string[],
) {
  return ids.flatMap((id) => {
    const item = itemsById.get(id);
    return item ? [item] : [];
  });
}

const tasksById = createIdMap(tasks);
const topicsById = createIdMap(topics);
const officialSourcesById = createIdMap(officialSources);
const studentTipsById = createIdMap(studentTips);
const askContactsById = createIdMap(askContacts);
const faqsById = createIdMap(faqs);

export function getAllTasks() {
  return tasks;
}

export function getTaskById(taskId: TaskId) {
  return tasksById.get(taskId);
}

export function getAllTopics() {
  return topics;
}

export function getTopicById(topicId: TopicId) {
  return topicsById.get(topicId);
}

export function getOfficialSourcesByIds(ids: readonly string[]) {
  return getByIds(officialSourcesById, ids);
}

export function getStudentTipsByIds(ids: readonly string[]) {
  return getByIds(studentTipsById, ids);
}

export function getAskContactsByIds(ids: readonly string[]) {
  return getByIds(askContactsById, ids);
}

export function getFaqsByIds(ids: readonly string[]) {
  return getByIds(faqsById, ids);
}

export function getContentMeta() {
  return contentMeta;
}
