import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { strFromU8, unzipSync } from 'fflate';
import type { PickedFile } from './import-builder';

export interface PickResult {
  files: PickedFile[];
  /** names we did not read (not .json, or a .zip with no followers/following file inside) */
  rejected: string[];
}

/** Only these files are taken out of an Instagram ZIP: followers_1.json, followers_2.json ..., following.json */
const WANTED = /(^|\/)(followers_\d+|following)\.json$/i;

/** Web has no native file API, so it uses fetch on the file link. */
async function readBytes(uri: string): Promise<Uint8Array> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    return new Uint8Array(await response.arrayBuffer());
  }
  return new File(uri).bytes();
}

async function readText(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    return response.text();
  }
  // SDK 58: read with `new File(uri).text()` (readAsStringAsync is legacy)
  return new File(uri).text();
}

/**
 * Let the user choose the Instagram export (.zip) or the .json files, and read their text.
 * Returns null when the picker is cancelled.
 */
export async function pickExportFiles(): Promise<PickResult | null> {
  const res = await DocumentPicker.getDocumentAsync({
    type: '*/*', // some Android pickers mark .json as unselectable with a strict mime filter
    multiple: true,
    copyToCacheDirectory: true,
  });
  if (res.canceled) return null;

  const files: PickedFile[] = [];
  const rejected: string[] = [];
  for (const asset of res.assets) {
    const lower = asset.name.toLowerCase();

    if (lower.endsWith('.zip')) {
      // unzip in memory and keep only the files we need
      const entries = unzipSync(await readBytes(asset.uri), { filter: (f) => WANTED.test(f.name) });
      const paths = Object.keys(entries);
      if (paths.length === 0) {
        rejected.push(asset.name);
        continue;
      }
      for (const path of paths) {
        files.push({ name: path.split('/').pop() as string, text: strFromU8(entries[path]) });
      }
      continue;
    }

    if (!lower.endsWith('.json')) {
      rejected.push(asset.name);
      continue;
    }
    files.push({ name: asset.name, text: await readText(asset.uri) });
  }
  return { files, rejected };
}