/* eslint-disable @typescript-eslint/no-var-requires */

import { Structures } from 'discord.js';
import { OriginMessage, extendus } from './lib/extensions/OriginMessage';
import OriginClient from './lib/OriginClient';
const env = require("dotenv").config();

extendus()
const bot = new OriginClient()
