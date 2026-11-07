import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import type { PickedFile } from './import-builder';

export interface PickResult {
  files: PickedFile[];
  /** names we did not read because they are not .json files */
  rejected: string[];
}

/**
 * Let the user choose several export files and read their text.
 * Returns null when the picker is cancelled.
 * SDK 58: read with `new File(uri).text()` (readAsStringAsync is legacy).
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
    if (!asset.name.toLowerCase().endsWith('.json')) {
      rejected.push(asset.name);
      continue;
    }
    files.push({ name: asset.name, text: await new File(asset.uri).text() });
  }
  return { files, rejected };
}
